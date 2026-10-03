from __future__ import annotations

import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3"
SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events"


def get_auth_url(state: str) -> str:
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GOOGLE_AUTH_URL}?{query}"


async def exchange_code(code: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(GOOGLE_TOKEN_URL, data={
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.google_redirect_uri,
        })
        resp.raise_for_status()
        return resp.json()


async def get_busy_times(access_token: str, time_min: str, time_max: str,
                         calendar_id: str = "primary") -> list[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{GOOGLE_CALENDAR_API}/freeBusy",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "timeMin": time_min,
                "timeMax": time_max,
                "items": [{"id": calendar_id}],
            },
        )
        if resp.status_code != 200:
            logger.warning("Google Calendar freebusy failed: %s", resp.text)
            return []
        data = resp.json()
        calendars = data.get("calendars", {})
        cal_data = calendars.get(calendar_id, {})
        return cal_data.get("busy", [])


async def create_event(access_token: str, summary: str, start: str, end: str,
                       attendees: list[str], description: str = "",
                       calendar_id: str = "primary") -> str | None:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{GOOGLE_CALENDAR_API}/calendars/{calendar_id}/events",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "summary": summary,
                "description": description,
                "start": {"dateTime": start},
                "end": {"dateTime": end},
                "attendees": [{"email": e} for e in attendees],
            },
        )
        if resp.status_code in (200, 201):
            return resp.json().get("id")
        logger.warning("Google Calendar event creation failed: %s", resp.text)
        return None
