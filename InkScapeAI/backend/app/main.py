"""InkScape AI — FastAPI entrypoint.

Run:  uvicorn app.main:app --reload  (from the backend/ directory)
Docs: http://127.0.0.1:8000/docs
"""
from __future__ import annotations

import base64

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse

from . import __version__
from .config import get_settings
from .pipeline import run_pipeline
from .schemas import GenerateRequest, GenerateResponse
from .styles import list_styles

app = FastAPI(
    title="InkScape AI · 墨境",
    version=__version__,
    description="一张照片，一幅中国画。 Turn a photo into a Chinese painting poster.",
)

# Wide-open CORS for local dev / the iOS app. Tighten for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    s = get_settings()
    return {"status": "ok", "version": __version__, "capabilities": s.summary()}


@app.get("/api/styles")
def styles() -> dict:
    return {"styles": list_styles()}


def _build_response(result) -> GenerateResponse:
    settings = get_settings()
    out_path = settings.output_dir / f"{result.id}.png"
    out_path.write_bytes(result.png_bytes)
    data_uri = "data:image/png;base64," + base64.b64encode(result.png_bytes).decode("ascii")
    return GenerateResponse(
        id=result.id,
        style=result.style,
        image_url=f"/api/poster/{result.id}.png",
        image_base64=data_uri,
        title=result.title,
        poem=result.poem,
        seal=result.seal,
        analysis=result.analysis,
    )


@app.post("/api/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest) -> GenerateResponse:
    """JSON endpoint: base64 image in, poster out (used by the iOS app)."""
    settings = get_settings()
    try:
        result = run_pipeline(
            req.image, req.style, settings,
            title_override=req.title, poem_override=req.poem,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"generation failed: {exc}") from exc
    return _build_response(result)


@app.post("/api/generate/upload", response_model=GenerateResponse)
async def generate_upload(
    file: UploadFile = File(...),
    style: str = Form("ink"),
    title: str = Form(None),
    poem: str = Form(None),
) -> GenerateResponse:
    """Multipart endpoint: convenient for curl / the web tester."""
    settings = get_settings()
    raw = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(raw) > max_bytes:
        raise HTTPException(status_code=413, detail="file too large")
    b64 = base64.b64encode(raw).decode("ascii")
    try:
        result = run_pipeline(b64, style, settings, title_override=title, poem_override=poem)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"generation failed: {exc}") from exc
    return _build_response(result)


@app.get("/api/poster/{name}")
def poster(name: str) -> FileResponse:
    settings = get_settings()
    path = (settings.output_dir / name).resolve()
    if settings.output_dir not in path.parents or not path.exists():
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(path, media_type="image/png")


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    """Tiny built-in tester so you can try the pipeline from a browser."""
    return _TESTER_HTML


_TESTER_HTML = """<!doctype html>
<html lang="zh"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>墨境 · InkScape AI</title>
<style>
 body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#222;background:#f7f3ea}
 h1{font-weight:600;letter-spacing:.1em}
 .card{background:#fff;border:1px solid #e5ddc9;border-radius:12px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.05)}
 select,button{font-size:16px;padding:8px 12px;border-radius:8px;border:1px solid #ccc}
 button{background:#b02a2a;color:#fff;border:none;cursor:pointer}
 img{max-width:100%;border-radius:8px;margin-top:16px}
 .muted{color:#888;font-size:14px}
</style></head>
<body>
 <h1>墨境 · InkScape AI</h1>
 <p class="muted">一张照片，一幅中国画。 Upload a photo, pick a style, 入画。</p>
 <div class="card">
  <input type="file" id="file" accept="image/*"><br><br>
  <select id="style"></select>
  <button onclick="go()">入画 / Generate</button>
  <p id="status" class="muted"></p>
  <div id="meta"></div>
  <img id="out" style="display:none">
 </div>
<script>
async function loadStyles(){
  const r = await fetch('/api/styles'); const {styles} = await r.json();
  const sel = document.getElementById('style');
  styles.forEach(s => { const o=document.createElement('option');
    o.value=s.id; o.textContent=s.name_zh+' · '+s.name_en; sel.appendChild(o); });
}
async function go(){
  const f = document.getElementById('file').files[0];
  if(!f){ alert('Choose a photo first'); return; }
  const fd = new FormData(); fd.append('file', f);
  fd.append('style', document.getElementById('style').value);
  document.getElementById('status').textContent = '生成中… generating…';
  const r = await fetch('/api/generate/upload', {method:'POST', body:fd});
  if(!r.ok){ document.getElementById('status').textContent = 'Error: '+await r.text(); return; }
  const d = await r.json();
  document.getElementById('status').textContent = '完成 · source: '+d.analysis.source;
  document.getElementById('meta').innerHTML =
    '<b>题字:</b> '+d.title+' &nbsp; <b>印:</b> '+d.seal+'<br><pre>'+d.poem+'</pre>';
  const img = document.getElementById('out');
  img.src = d.image_base64; img.style.display='block';
}
loadStyles();
</script>
</body></html>"""
