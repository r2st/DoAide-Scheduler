from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tools", tags=["tools"])

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


class AgendaRequest(BaseModel):
    meeting_type: str = Field(max_length=100, examples=["1-on-1", "standup", "client call"])
    duration_minutes: int = Field(ge=5, le=480, default=30)
    attendee_count: int = Field(ge=2, le=100, default=3)
    goal: str = Field(default="", max_length=500)


class AgendaResponse(BaseModel):
    agenda: str
    tips: list[str]


@router.post("/suggest-agenda", response_model=AgendaResponse)
async def suggest_agenda(req: AgendaRequest) -> AgendaResponse:
    if not settings.gemini_api_key:
        raise HTTPException(503, "AI service not configured")

    prompt = (
        f"Generate a concise meeting agenda for a {req.duration_minutes}-minute "
        f"{req.meeting_type} meeting with {req.attendee_count} attendees."
    )
    if req.goal:
        prompt += f" The goal is: {req.goal}"
    prompt += (
        "\n\nReturn ONLY valid JSON with two keys:\n"
        '- "agenda": a formatted agenda string with numbered items and time allocations\n'
        '- "tips": an array of 3-4 short practical tips for running this meeting effectively\n'
        "No markdown, no code fences, just raw JSON."
    )

    url = GEMINI_URL.format(model=settings.gemini_model)
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json=payload,
                params={"key": settings.gemini_api_key},
            )
            resp.raise_for_status()
            data = resp.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"]
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        import json as _json

        parsed = _json.loads(cleaned)
        return AgendaResponse(
            agenda=parsed.get("agenda", ""),
            tips=parsed.get("tips", []),
        )
    except httpx.HTTPStatusError as exc:
        logger.error("Gemini API error: %s %s", exc.response.status_code, exc.response.text[:200])
        raise HTTPException(502, "AI service returned an error") from exc
    except Exception as exc:
        logger.error("Agenda generation failed: %s", exc)
        raise HTTPException(502, "Failed to generate agenda") from exc
