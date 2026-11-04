# Architecture

## Principle
One stable API contract, swappable AI backends. The iOS app and the poster
compositor never need to know whether the painting came from a local Pillow
filter, ComfyUI, or a hosted Flux endpoint — or whether the poem came from GPT
or a preset table. That's what lets V0.1 ship offline and grow without rewrites.

## Request flow
```
POST /api/generate  { style, image(base64) }
        │
        ▼
pipeline.run_pipeline
        ├─ analysis.analyze(photo, style)      → Analysis{title, poem, source}
        │     └─ GPT (if OPENAI_API_KEY) else curated presets from styles.py
        ├─ generation.generate_painting(photo) → PIL.Image (painting content)
        │     └─ GENERATOR = local | comfyui | flux   (falls back to local)
        └─ compose.make_poster(painting, ...)  → PIL.Image (mounted poster)
              └─ vertical 题字 + 落款诗 + drawn 印章 + scroll border
        │
        ▼
GenerateResponse { image_url, image_base64, title, poem, seal, analysis }
```

## Seams (where to upgrade)
| Want better… | Edit | Contract |
|--------------|------|----------|
| photo understanding / poetry | `analysis._gpt_analysis` | return `Analysis` |
| brushwork / real generation | `generation._try_comfyui` / `_try_flux` | return `PIL.Image` or `None` |
| styles | `styles.STYLES` | add a `Style` entry |
| mounting / calligraphy / seal | `compose.make_poster` | return `PIL.Image` |

Because each seam has a narrow type contract, an upgrade is a local change with
the smoke tests (`tests/test_pipeline.py`) guarding the offline path.

## Local ink engine (V0.1 default)
`generation.stylize_local` is intentionally simple and CPU-only:
1. luminance → softened tonal map (median + gaussian) → ink density curve,
   keeping highlights as bare paper (留白);
2. `FIND_EDGES` → ink-line emphasis;
3. composite ink color over rice-paper color per pixel;
4. optional color styles blend a desaturated source back in + a mineral tint;
5. deterministic paper grain.

It is a placeholder for real diffusion generation, but produces a coherent,
shareable poster on day one.

## Deployment
- **Dev:** `./run.sh` (uvicorn --reload) or `docker compose up`.
- **Prod:** the Docker image serves uvicorn on :8000; put it behind an HTTPS
  reverse proxy and set the iOS `baseURL` to that host. Mount a volume for
  `outputs/` if you want posters to persist.
