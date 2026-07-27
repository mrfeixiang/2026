# Fonts

No fonts are bundled (licensing). The backend auto-detects a system CJK font
(macOS PingFang/Songti, or Noto CJK on Linux/Docker). For nicer calligraphy:

1. Drop a `.ttf`/`.otf`/`.ttc` here (rename to `cjk.ttf` for auto-pickup), or
2. Set `INKSCAPE_FONT=/absolute/path/to/font.ttf` before starting the backend.

Good freely-licensed options: **Noto Serif/Sans CJK SC**, **源云明体 / 霞鹜文楷
(LXGW WenKai, OFL)**. For a brush look, any OFL calligraphy CJK font works.
Fonts are git-ignored by default.
