"""Font resolution for CJK text rendering.

We do NOT bundle copyrighted fonts. Instead we probe common system paths
(macOS ships PingFang / Songti; many Linux boxes have Noto CJK). If nothing
is found, callers should degrade gracefully rather than crash.

To use a nicer brush/calligraphy font, drop a .ttf/.otf into
InkScapeAI/Assets/Fonts and set INKSCAPE_FONT=/abs/path/to/font.ttf.
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Optional

_CANDIDATES = [
    # explicit override first
    os.getenv("INKSCAPE_FONT", ""),
    # macOS
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Songti.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/Library/Fonts/Songti.ttc",
    # Linux (Noto / WenQuanYi / Droid)
    "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
    # project-local drop-in
    str(Path(__file__).resolve().parents[2] / "Assets" / "Fonts" / "cjk.ttf"),
    str(Path(__file__).resolve().parents[2] / "Assets" / "Fonts" / "cjk.otf"),
]


@lru_cache(maxsize=1)
def find_cjk_font() -> Optional[str]:
    for path in _CANDIDATES:
        if path and Path(path).exists():
            return path
    return None
