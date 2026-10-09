from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_suggest_agenda_no_api_key():
    resp = client.post(
        "/api/v1/tools/suggest-agenda",
        json={"meeting_type": "standup", "duration_minutes": 15, "attendee_count": 5},
    )
    assert resp.status_code == 503
    assert "not configured" in resp.json()["detail"].lower()


def test_suggest_agenda_validation():
    resp = client.post(
        "/api/v1/tools/suggest-agenda",
        json={"meeting_type": "x" * 200, "duration_minutes": 15, "attendee_count": 5},
    )
    assert resp.status_code == 422


def test_suggest_agenda_duration_range():
    resp = client.post(
        "/api/v1/tools/suggest-agenda",
        json={"meeting_type": "standup", "duration_minutes": 0, "attendee_count": 5},
    )
    assert resp.status_code == 422


@patch("app.routers.tools.settings")
def test_suggest_agenda_gemini_error(mock_settings):
    mock_settings.gemini_api_key = "test-key"
    mock_settings.gemini_model = "gemini-3.8-flash"

    with patch("app.routers.tools.httpx.AsyncClient") as mock_client_cls:
        mock_resp = AsyncMock()
        mock_resp.status_code = 500
        mock_resp.raise_for_status.side_effect = Exception("API error")
        mock_client = AsyncMock()
        mock_client.post.return_value = mock_resp
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        resp = client.post(
            "/api/v1/tools/suggest-agenda",
            json={"meeting_type": "standup", "duration_minutes": 15, "attendee_count": 5},
        )
        assert resp.status_code == 502
