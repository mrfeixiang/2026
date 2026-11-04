# Models

Place local image-generation assets here when you move beyond the V0.1 Pillow
engine — e.g. a Flux/SDXL checkpoint, ControlNet weights, or an exported
ComfyUI `workflow_api.json`.

Wire them up in `backend/app/generation.py`:
- `_try_comfyui` — POST an image + your workflow to `COMFYUI_URL`, poll, return the result.
- `_try_flux` — call your Flux-compatible endpoint (`FLUX_API_URL` / `FLUX_API_KEY`).

Both must return a `PIL.Image` (or `None` to fall back to local stylization).
Large binaries are git-ignored.
