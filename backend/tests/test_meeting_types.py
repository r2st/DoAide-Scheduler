from __future__ import annotations


def test_create_meeting_type(client, auth_headers):
    resp = client.post("/api/v1/meeting-types/", json={
        "name": "Quick Chat",
        "duration_minutes": 15,
        "color": "#10B981",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Quick Chat"
    assert data["duration_minutes"] == 15
    assert data["slug"] == "quick-chat"


def test_list_meeting_types(client, auth_headers):
    client.post("/api/v1/meeting-types/", json={
        "name": "Type A",
        "duration_minutes": 30,
    }, headers=auth_headers)
    client.post("/api/v1/meeting-types/", json={
        "name": "Type B",
        "duration_minutes": 60,
    }, headers=auth_headers)

    resp = client.get("/api/v1/meeting-types/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_update_meeting_type(client, auth_headers):
    create = client.post("/api/v1/meeting-types/", json={
        "name": "Original",
        "duration_minutes": 30,
    }, headers=auth_headers)
    mt_id = create.json()["id"]

    resp = client.patch(f"/api/v1/meeting-types/{mt_id}", json={
        "name": "Updated",
        "duration_minutes": 45,
    }, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated"
    assert resp.json()["duration_minutes"] == 45


def test_delete_meeting_type(client, auth_headers):
    create = client.post("/api/v1/meeting-types/", json={
        "name": "To Delete",
        "duration_minutes": 30,
    }, headers=auth_headers)
    mt_id = create.json()["id"]

    resp = client.delete(f"/api/v1/meeting-types/{mt_id}", headers=auth_headers)
    assert resp.status_code == 204

    resp = client.get(f"/api/v1/meeting-types/{mt_id}", headers=auth_headers)
    assert resp.status_code == 404
