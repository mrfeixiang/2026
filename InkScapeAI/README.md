<div align="center">

# 墨境 · InkScape AI

**一张照片，一幅中国画。**
*One photo, one Chinese painting.*

</div>

InkScape AI turns an ordinary photo into a finished Chinese-painting **poster** —
not just a filter, but an art director: it reads the photo, paints it in a chosen
tradition, writes a matching couplet, sets a title in vertical calligraphy, stamps
a red seal, and mounts it like a hanging scroll.

> **Design principle — start small, ship day one.** This repo is **V0.1**: a
> complete, runnable end-to-end pipeline that works on a laptop with **no GPU and
> no API keys**. Every AI upgrade (GPT analysis, Flux/ComfyUI generation) plugs
> into stable seams without changing the app.

## What V0.1 does today
- 📸 iPhone app (SwiftUI): pick a photo → choose a style → **入画** → save / share.
- 🎨 6 styles: 水墨山水 · 青绿山水 · 工笔花鸟 · 敦煌壁画 · 古风人物 · 中国动漫.
- 🖌️ Painting via a dependency-free **Pillow ink engine** (upgradeable to Flux/ComfyUI).
- ✍️ Poem + 4-char title (curated presets, or GPT when a key is set).
- 🟥 Procedurally drawn 印章 (seal) + scroll mounting — no image assets needed.
- 🐳 `docker compose up` or `./run.sh` — running in one command.

## Pipeline
```
 iPhone (SwiftUI)
      │ upload photo + style
      ▼
 FastAPI  ──▶ analyze (GPT / preset)  ─┐
      │                                ├─▶ compose:  mount + 题字 + 诗 + 印章
      └──▶ paint (Pillow / Flux / ComfyUI)┘            │
                                                        ▼
                                              高清国画海报 (PNG)
```

## Repository layout
```
InkScapeAI/
├── backend/          FastAPI + Pillow pipeline  (runs standalone)
│   ├── app/          main, config, styles, analysis, generation, compose, pipeline
│   ├── tests/        offline smoke tests (every style → valid PNG)
│   ├── Dockerfile · docker-compose.yml · run.sh
│   └── README.md
├── ios/              SwiftUI app (HomeView, ResultView, API client)
│   └── README.md     Xcode setup in 5 minutes
├── Assets/Fonts/     drop a CJK/brush font here (none bundled)
├── Models/           place local generator weights/workflows here
├── docs/ARCHITECTURE.md
└── README.md
```

## Get running
```bash
# 1) Backend (zero config)
cd InkScapeAI/backend && ./run.sh
#    open http://127.0.0.1:8000  → try it in the browser

# 2) iOS app
#    see ios/README.md to create the Xcode project and point it at the backend
```

## Roadmap
- **V0.1 (this)** — end-to-end, offline-capable, browser + iOS tester.
- **V0.2** — GPT photo analysis, auto poem/title/seal, auto mounting.
- **V0.3** — Flux/ComfyUI + ControlNet for true brushwork; more styles.
- **V0.4** — "art universes": 浮世绘 · 剪纸 · 青花瓷 · 京剧脸谱 · 唐卡 · 赛博朋克 …
- **Later** — TestFlight build.

## Originality & licensing note
Style prompts describe **aesthetic traditions**, never a specific copyrighted
painting or a living artist's name, and animation styles are original (no
copyrighted characters). No fonts are bundled — see `Assets/Fonts/README.md`.
