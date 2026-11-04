"""Compose a finished 国画 poster: mounting + 题字 + 落款诗 + 印章.

Everything here is Pillow-only so it renders on any machine. Chinese text is
drawn vertically (top-to-bottom columns, right-to-left), the way it appears on
a hanging scroll. A red seal is drawn procedurally — no image assets required.
"""
from __future__ import annotations

from typing import List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont

from .fonts import find_cjk_font
from .styles import Style

_PAPER = (239, 231, 211)
_INK = (26, 26, 26)
_SEAL_RED = (176, 42, 42)


def _font(size: int) -> Optional[ImageFont.FreeTypeFont]:
    path = find_cjk_font()
    if not path:
        return None
    try:
        return ImageFont.truetype(path, size=size)
    except Exception:
        return None


def _char_size(font: ImageFont.FreeTypeFont, ch: str) -> Tuple[int, int]:
    box = font.getbbox(ch)
    return box[2] - box[0], box[3] - box[1]


def draw_vertical_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    x: int,
    top: int,
    font: ImageFont.FreeTypeFont,
    fill: Tuple[int, int, int],
    gap: float = 0.25,
) -> int:
    """Draw a single top-to-bottom column. Returns the y after the last char."""
    y = top
    line_h = font.size
    for ch in text:
        if ch in ("\n", " "):
            y += int(line_h * 0.5)
            continue
        cw, _ = _char_size(font, ch)
        # center the glyph horizontally within the column
        draw.text((x + (line_h - cw) // 2, y), ch, font=font, fill=fill)
        y += int(line_h * (1 + gap))
    return y


def draw_vertical_block(
    draw: ImageDraw.ImageDraw,
    lines: List[str],
    right_x: int,
    top: int,
    font: ImageFont.FreeTypeFont,
    fill: Tuple[int, int, int],
    col_gap: float = 0.4,
) -> None:
    """Draw multiple columns right-to-left (classical reading order)."""
    col_w = int(font.size * (1 + col_gap))
    x = right_x - font.size
    for line in lines:
        draw_vertical_text(draw, line, x, top, font, fill)
        x -= col_w


def make_seal(text: str, size: int) -> Image.Image:
    """Procedural red intaglio-style seal with the given 1-4 chars."""
    seal = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(seal)
    d.rounded_rectangle(
        [2, 2, size - 3, size - 3], radius=int(size * 0.08),
        outline=_SEAL_RED, width=max(3, size // 22),
    )
    chars = [c for c in text if c.strip()][:4] or ["印"]
    font = _font(int(size * 0.42))
    if font is None:
        return seal  # graceful: empty frame if no CJK font

    # Arrange up to 4 chars in a grid (1x1, 1x2, or 2x2), traditional order.
    if len(chars) == 1:
        cells = [(0.5, 0.5)]
    elif len(chars) == 2:
        cells = [(0.5, 0.28), (0.5, 0.72)]
    elif len(chars) == 3:
        cells = [(0.72, 0.28), (0.72, 0.72), (0.28, 0.5)]
    else:  # 4 chars, read top-right, bottom-right, top-left, bottom-left
        cells = [(0.72, 0.28), (0.72, 0.72), (0.28, 0.28), (0.28, 0.72)]

    for ch, (fx, fy) in zip(chars, cells):
        cw, chh = _char_size(font, ch)
        d.text((fx * size - cw / 2, fy * size - chh / 2 - font.size * 0.15),
               ch, font=font, fill=_SEAL_RED)
    return seal


def make_poster(
    painting: Image.Image,
    title: str,
    poem: str,
    style: Style,
    long_edge: int = 1536,
) -> Image.Image:
    """Mount the painting on paper with inscription and seal."""
    # Portrait 3:4 scroll canvas.
    W = int(long_edge * 0.75)
    H = long_edge
    canvas = Image.new("RGB", (W, H), _PAPER)
    draw = ImageDraw.Draw(canvas)

    margin = int(W * 0.06)
    inscription_w = int(W * 0.20)  # reserved right column for 题字/落款

    # --- painting box (with a thin double mounting border) ---
    box_l = margin
    box_t = int(H * 0.06)
    box_r = W - margin - inscription_w
    box_b = int(H * 0.82)
    bw, bh = box_r - box_l, box_b - box_t

    fitted = painting.copy()
    fitted.thumbnail((bw, bh), Image.LANCZOS)
    px = box_l + (bw - fitted.width) // 2
    py = box_t + (bh - fitted.height) // 2
    canvas.paste(fitted, (px, py))
    draw.rectangle(
        [px - 6, py - 6, px + fitted.width + 6, py + fitted.height + 6],
        outline=(120, 110, 90), width=2,
    )

    # --- inscription (right side, vertical, read right-to-left) ---
    # Rightmost column = 题字 (title); 落款 poem columns sit to its LEFT.
    title_font = _font(int(W * 0.055))
    poem_font = _font(int(W * 0.032))
    inscription_right = W - margin
    title_col_x = inscription_right - (title_font.size if title_font else 0)
    if title_font and title:
        draw_vertical_text(draw, title, title_col_x, box_t + 4, title_font, _INK)
    if poem_font and poem:
        lines = [ln for ln in poem.split("\n") if ln.strip()]
        poem_right = title_col_x - int(W * 0.015)
        draw_vertical_block(draw, lines, poem_right, box_t + int(H * 0.02),
                            poem_font, _INK)

    # --- seal (bottom of the inscription column) ---
    seal_size = int(W * 0.10)
    seal = make_seal(style.seal, seal_size)
    canvas.paste(seal, (W - margin - seal_size, box_b - seal_size + int(H * 0.02)), seal)

    return canvas
