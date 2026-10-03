from __future__ import annotations


def test_list_members(client, auth_headers):
    resp = client.get("/api/v1/team/members", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_add_member(client, auth_headers):
    resp = client.post("/api/v1/team/members", json={
        "email": "member@example.com",
        "full_name": "Team Member",
        "role": "member",
        "password": "memberpass123",
    }, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.json()["email"] == "member@example.com"
    assert resp.json()["role"] == "member"


def test_remove_member(client, auth_headers):
    create = client.post("/api/v1/team/members", json={
        "email": "remove@example.com",
        "full_name": "Remove Me",
        "role": "member",
        "password": "removepass123",
    }, headers=auth_headers)
    member_id = create.json()["id"]

    resp = client.delete(f"/api/v1/team/members/{member_id}", headers=auth_headers)
    assert resp.status_code == 204
