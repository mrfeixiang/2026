"""Request / response models."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    style: str = Field(default="ink", description="Style id, e.g. 'ink'")
    image: str = Field(..., description="Base64-encoded source photo (data URI ok)")
    title: Optional[str] = Field(default=None, description="Override 题字")
    poem: Optional[str] = Field(default=None, description="Override 落款诗")


class Analysis(BaseModel):
    themes: List[str] = []
    suggested_style: Optional[str] = None
    title: Optional[str] = None
    poem: Optional[str] = None
    source: str = "preset"  # "gpt" or "preset"


class GenerateResponse(BaseModel):
    id: str
    style: str
    image_url: str          # served poster PNG
    image_base64: str       # data URI, so the client needs no second request
    title: str
    poem: str
    seal: str
    analysis: Analysis
