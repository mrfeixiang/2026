# InkScape AI — Backend (FastAPI)

Turns a photo into a finished 国画 poster: **analyze → paint → mount + 题字 + 诗 + 印章**.

The whole pipeline runs **with zero API keys and no GPU** — a pure-Pillow ink
stylization produces the painting and curated presets supply the poem/title/seal.
Configure OpenAI and/or a real image generator to upgrade quality later; the
API shape never changes.

## Quick start
```bash
cd backend
./run.sh                       # creates venv, installs deps, starts uvicorn
# open http://127.0.0.1:8000   -> built-in browser tester
# open http://127.0.0.1:8000/docs -> OpenAPI
```

Or with Docker (bundles Noto CJK fonts):
```bash
cd backend
docker compose up --build
```

## Endpoints
| Method | Path                     | Purpose                                  |
|--------|--------------------------|------------------------------------------|
| GET    | `/health`                | status + active capabilities             |
| GET    | `/api/styles`            | list styles (id / 中文名 / English / seal) |
| POST   | `/api/generate`          | JSON `{style, image(base64)}` → poster    |
| POST   | `/api/generate/upload`   | multipart file upload → poster            |
| GET    | `/api/poster/{id}.png`   | fetch a rendered poster                   |

`/api/generate` response includes both `image_url` and `image_base64`
(a data URI) so the iOS app needs only one round trip.

## Configuration (`.env`, all optional)
| Var | Default | Effect |
|-----|---------|--------|
| `OPENAI_API_KEY` | — | when set, GPT reads the photo and writes the poem/title |
| `OPENAI_MODEL` | `gpt-4o-mini` | vision+text model |
| `GENERATOR` | `local` | `local` (Pillow), `comfyui`, or `flux` |
| `COMFYUI_URL` | `http://127.0.0.1:8188` | ComfyUI endpoint (hook) |
| `FLUX_API_URL` / `FLUX_API_KEY` | — | Flux-compatible endpoint (hook) |
| `POSTER_LONG_EDGE` | `1536` | output resolution |

## Layout
```
app/
  main.py        FastAPI routes + built-in browser tester
  config.py      env-driven settings (safe empty defaults)
  styles.py      style catalog: prompts, local params, preset poems/titles/seals
  analysis.py    photo -> themes/poem/title  (GPT, else presets)
  generation.py  photo -> painting content   (local Pillow, else ComfyUI/Flux hooks)
  compose.py     painting -> mounted poster: vertical 题字/诗 + drawn 印章
  pipeline.py    orchestrates the above
  fonts.py       locate a system CJK font (no bundled fonts)
```

## Tests
```bash
source .venv/bin/activate && pytest -q
```
`tests/test_pipeline.py` renders every style offline and asserts a valid PNG.

## Upgrading the painting quality
`generation.py` has `_try_comfyui` / `_try_flux` stubs that currently return
`None` (→ local fallback). Wire your workflow/endpoint there; return a
`PIL.Image`. Everything downstream (mounting, inscription, seal) is unchanged.
The style prompts in `styles.py` describe *aesthetic traditions*, never a
specific copyrighted artwork or living artist.
