"""Turn a photo into painting *content* (not yet mounted/inscribed).

GENERATOR=local  -> dependency-free Pillow ink stylization (default, always works)
GENERATOR=comfyui -> POST to a ComfyUI instance (hook; needs a workflow json)
GENERATOR=flux    -> POST to a Flux-compatible HTTP endpoint (hook)

The remote hooks are intentionally thin and fall back to local stylization on
any failure, so the product never returns nothing.
"""
from __future__ import annotations

import io
from typing import Tuple

import numpy as np
from PIL import Image, ImageFilter, ImageOps

from .config import Settings
from .styles import Style, StyleLocalParams


def _hex_to_rgb(value: str) -> Tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore


def _load(image_bytes: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img)  # honor phone orientation
    return img.convert("RGB")


def _fit_long_edge(img: Image.Image, long_edge: int) -> Image.Image:
    w, h = img.size
    scale = long_edge / max(w, h)
    if scale < 1.0:
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    return img


def stylize_local(img: Image.Image, p: StyleLocalParams) -> Image.Image:
    """Core ink-painting transform. Pure Pillow + numpy, CPU only."""
    paper = np.array(_hex_to_rgb(p.paper), dtype=np.float32)
    ink = np.array(_hex_to_rgb(p.ink), dtype=np.float32)

    # --- 1. luminance, softened so brush washes read as tonal areas ---
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    soft = gray.filter(ImageFilter.MedianFilter(size=5))
    soft = soft.filter(ImageFilter.GaussianBlur(radius=1.4))
    lum = np.asarray(soft, dtype=np.float32) / 255.0

    # contrast curve around mid-grey -> ink density (1 = full ink)
    density = np.clip((0.5 + (0.5 - lum) * p.contrast), 0.0, 1.0)
    density = density * p.wash  # keep highlights as bare paper (留白)

    # --- 2. ink lines from edges ---
    edges = gray.filter(ImageFilter.GaussianBlur(0.6)).filter(ImageFilter.FIND_EDGES)
    e = np.asarray(edges, dtype=np.float32) / 255.0
    density = np.clip(density + e * p.edge_strength, 0.0, 1.0)

    d = density[..., None]  # H x W x 1

    # --- 3. lay ink onto rice paper ---
    canvas = paper * (1.0 - d) + ink * d

    # --- 4. optional color: blend a desaturated version of the source back in ---
    if p.saturation > 0:
        color = np.asarray(img, dtype=np.float32)
        g3 = np.asarray(img.convert("L").convert("RGB"), dtype=np.float32)
        color = g3 * (1 - p.saturation) + color * p.saturation
        # paint color where the paper shows through (lighter ink areas)
        show = np.clip(1.0 - d, 0.0, 1.0) * 0.6
        canvas = canvas * (1 - show) + color * show

    if p.tint:
        tint = np.array(_hex_to_rgb(p.tint), dtype=np.float32)
        canvas = canvas * 0.82 + tint * 0.18

    # --- 5. paper grain ---
    if p.grain > 0:
        rng = np.random.default_rng(1234)  # deterministic grain
        noise = rng.normal(0.0, 255.0 * p.grain * 0.15, canvas.shape[:2])
        canvas += noise[..., None]

    canvas = np.clip(canvas, 0, 255).astype(np.uint8)
    return Image.fromarray(canvas, "RGB")


def _try_comfyui(image_bytes: bytes, style: Style, settings: Settings) -> Image.Image | None:
    """Placeholder hook. Wire a ComfyUI workflow here when you have one running.

    Kept as a stub in V0.1 so the app never blocks on a GPU. Returning None
    makes the caller fall back to local stylization.
    """
    return None


def _try_flux(image_bytes: bytes, style: Style, settings: Settings) -> Image.Image | None:
    """Placeholder hook for a Flux-compatible HTTP endpoint. See docs."""
    return None


def generate_painting(image_bytes: bytes, style: Style, settings: Settings) -> Image.Image:
    """Return painting content sized to the configured long edge."""
    result: Image.Image | None = None
    if settings.generator == "comfyui":
        result = _try_comfyui(image_bytes, style, settings)
    elif settings.generator == "flux":
        result = _try_flux(image_bytes, style, settings)

    if result is None:
        img = _fit_long_edge(_load(image_bytes), settings.poster_long_edge)
        result = stylize_local(img, style.local)
    return result
