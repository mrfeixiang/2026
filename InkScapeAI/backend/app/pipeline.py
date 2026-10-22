"""End-to-end orchestration: photo bytes -> finished poster.

    photo ──▶ analyze (GPT/preset) ──▶ generate painting (local/Flux/ComfyUI)
          └────────────────────────▶ compose (mount + 题字 + 诗 + 印章) ──▶ PNG
"""
from __future__ import annotations

import base64
import io
import uuid
from dataclasses import dataclass

from PIL import Image

from . import analysis as analysis_mod
from . import compose, generation
from .config import Settings
from .schemas import Analysis
from .styles import Style, get_style


@dataclass
class PosterResult:
    id: str
    style: str
    png_bytes: bytes
    title: str
    poem: str
    seal: str
    analysis: Analysis


def _decode_image(image_field: str) -> bytes:
    """Accept raw base64 or a data URI."""
    if "," in image_field and image_field.strip().startswith("data:"):
        image_field = image_field.split(",", 1)[1]
    return base64.b64decode(image_field)


def run_pipeline(
    image_field: str,
    style_id: str,
    settings: Settings,
    title_override: str | None = None,
    poem_override: str | None = None,
) -> PosterResult:
    image_bytes = _decode_image(image_field)
    style: Style = get_style(style_id)

    # 1. understand the photo (or fall back to curated presets)
    result = analysis_mod.analyze(image_bytes, style, settings)

    title = (title_override or result.title or (style.titles[0] if style.titles else "")).strip()
    poem = (poem_override or result.poem or (style.poems[0] if style.poems else "")).strip()

    # 2. paint
    painting: Image.Image = generation.generate_painting(image_bytes, style, settings)

    # 3. mount + inscribe + seal
    poster = compose.make_poster(
        painting, title, poem, style, long_edge=settings.poster_long_edge
    )

    buf = io.BytesIO()
    poster.save(buf, format="PNG")

    return PosterResult(
        id=uuid.uuid4().hex[:12],
        style=style.id,
        png_bytes=buf.getvalue(),
        title=title,
        poem=poem,
        seal=style.seal,
        analysis=result,
    )
