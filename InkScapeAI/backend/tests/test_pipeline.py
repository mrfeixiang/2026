"""Smoke tests: the full pipeline must run offline (no keys, no GPU)."""
import base64
import io

from PIL import Image

from app.config import get_settings
from app.pipeline import run_pipeline
from app.styles import STYLES


def _sample_photo_b64() -> str:
    img = Image.new("RGB", (640, 480))
    px = img.load()
    for y in range(480):
        for x in range(640):
            px[x, y] = ((x + y) % 256, (x * 2) % 256, (y * 3) % 256)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


def test_generates_poster_for_every_style():
    settings = get_settings()
    photo = _sample_photo_b64()
    for style_id in STYLES:
        result = run_pipeline(photo, style_id, settings)
        assert result.png_bytes[:8] == b"\x89PNG\r\n\x1a\n"
        assert result.style == style_id
        # analysis falls back to presets with no API key
        assert result.analysis.source in {"preset", "gpt"}
        out = Image.open(io.BytesIO(result.png_bytes))
        assert out.width > 0 and out.height > 0


def test_accepts_data_uri():
    settings = get_settings()
    photo = "data:image/jpeg;base64," + _sample_photo_b64()
    result = run_pipeline(photo, "ink", settings)
    assert result.png_bytes[:4] == b"\x89PNG"
