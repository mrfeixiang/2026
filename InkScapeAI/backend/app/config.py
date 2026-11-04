"""Runtime configuration, loaded from environment / .env.

Design goal: the app must run with an empty environment. Every AI provider
is optional and falls back to a local, dependency-free implementation.
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

try:  # load .env if python-dotenv or pydantic-settings is around; optional
    from dotenv import load_dotenv  # type: ignore

    load_dotenv()
except Exception:  # pragma: no cover - dotenv is optional
    pass


class Settings:
    """Plain settings object (no hard pydantic-settings dependency)."""

    def __init__(self) -> None:
        self.openai_api_key: str = os.getenv("OPENAI_API_KEY", "").strip()
        self.openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()

        self.generator: str = os.getenv("GENERATOR", "local").strip().lower()
        self.comfyui_url: str = os.getenv("COMFYUI_URL", "http://127.0.0.1:8188").strip()
        self.flux_api_url: str = os.getenv("FLUX_API_URL", "").strip()
        self.flux_api_key: str = os.getenv("FLUX_API_KEY", "").strip()

        self.output_dir: Path = Path(os.getenv("OUTPUT_DIR", "outputs")).resolve()
        self.max_upload_mb: int = int(os.getenv("MAX_UPLOAD_MB", "15"))
        self.poster_long_edge: int = int(os.getenv("POSTER_LONG_EDGE", "1536"))

        self.output_dir.mkdir(parents=True, exist_ok=True)

    @property
    def has_openai(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def uses_remote_generator(self) -> bool:
        return self.generator in {"comfyui", "flux"}

    def summary(self) -> dict:
        """Non-secret capability summary for the /health endpoint."""
        return {
            "generator": self.generator,
            "gpt_analysis": self.has_openai,
            "gpt_poetry": self.has_openai,
            "poster_long_edge": self.poster_long_edge,
        }


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
