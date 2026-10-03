from __future__ import annotations


def test_list_availability(client, auth_headers):
    resp = client.get("/api/v1/availability/", headers=auth_headers)
    assert resp.status_code == 200
    # Registration creates Mon-Fri 9-17 rules
    assert len(resp.json()) == 5


def test_create_availability_rule(client, auth_headers):
    resp = client.post("/api/v1/availability/", json={
        "day_of_week": 5,
        "start_time": "10:00",
        "end_time": "14:00",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["day_of_week"] == 5
    assert data["start_time"] == "10:00"


def test_update_availability_rule(client, auth_headers):
    rules = client.get("/api/v1/availability/", headers=auth_headers).json()
    rule_id = rules[0]["id"]

    resp = client.patch(f"/api/v1/availability/{rule_id}", json={
        "start_time": "08:00",
        "end_time": "16:00",
    }, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["start_time"] == "08:00"


def test_delete_availability_rule(client, auth_headers):
    rules = client.get("/api/v1/availability/", headers=auth_headers).json()
    rule_id = rules[0]["id"]

    resp = client.delete(f"/api/v1/availability/{rule_id}", headers=auth_headers)
    assert resp.status_code == 204
