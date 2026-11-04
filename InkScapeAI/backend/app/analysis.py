"""Photo understanding + poetry.

If OPENAI_API_KEY is configured we ask GPT to (a) read the photo's mood and
(b) write a short classical-style couplet + a 4-char title. Otherwise we
return curated presets for the chosen style. Either path yields the same
`Analysis` shape, so the rest of the pipeline is provider-agnostic.
"""
from __future__ import annotations

import base64
import json
import random
from typing import Optional

from .config import Settings
from .schemas import Analysis
from .styles import Style


def _preset_analysis(style: Style) -> Analysis:
    return Analysis(
        themes=[],
        suggested_style=style.id,
        title=random.choice(style.titles) if style.titles else "",
        poem=random.choice(style.poems) if style.poems else "",
        source="preset",
    )


def analyze(image_bytes: bytes, style: Style, settings: Settings) -> Analysis:
    """Return an Analysis for the photo. Never raises — falls back to presets."""
    if not settings.has_openai:
        return _preset_analysis(style)

    try:
        return _gpt_analysis(image_bytes, style, settings)
    except Exception as exc:  # pragma: no cover - network/credential issues
        preset = _preset_analysis(style)
        preset.themes = [f"gpt_unavailable: {type(exc).__name__}"]
        return preset


def _gpt_analysis(image_bytes: bytes, style: Style, settings: Settings) -> Analysis:
    # Imported lazily so the package works without the openai dependency.
    from openai import OpenAI  # type: ignore

    client = OpenAI(api_key=settings.openai_api_key)
    b64 = base64.b64encode(image_bytes).decode("ascii")

    system = (
        "You are an art director for a Chinese-painting generator. "
        "Read the photo and respond ONLY with compact JSON:\n"
        '{"themes": ["..."], "title": "四字题字", '
        '"poem": "第一句，\\n第二句。"}\n'
        "The title must be exactly four Chinese characters. The poem is a "
        "two-line classical-style couplet (original wording, do not quote a "
        "famous poem verbatim). Match the mood to the chosen style: "
        f"{style.name_zh} ({style.name_en})."
    )

    resp = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.9,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this photo."},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
                    },
                ],
            },
        ],
        max_tokens=300,
    )
    data = json.loads(resp.choices[0].message.content or "{}")
    return Analysis(
        themes=list(data.get("themes", []))[:5],
        suggested_style=style.id,
        title=(data.get("title") or "").strip(),
        poem=(data.get("poem") or "").strip(),
        source="gpt",
    )
