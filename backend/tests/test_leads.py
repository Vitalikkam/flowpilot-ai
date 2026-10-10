def test_create_lead(client):
    response = client.post(
        "/api/leads",
        json={
            "name": "Alex Morgan",
            "email": "alex@example.com",
            "company": "Morgan Digital",
            "message": "We need a custom web application.",
            "source": "website",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["priority"] is None
    assert "id" in data


def test_create_lead_rejects_invalid_email(client):
    response = client.post(
        "/api/leads",
        json={
            "name": "Bad Email",
            "email": "not-an-email",
            "message": "hi",
            "source": "website",
        },
    )
    assert response.status_code == 422


def test_create_lead_rejects_empty_name(client):
    response = client.post(
        "/api/leads",
        json={
            "name": "",
            "email": "x@example.com",
            "message": "hi",
            "source": "website",
        },
    )
    assert response.status_code == 422


def test_get_lead_404(client):
    response = client.get("/api/leads/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_list_and_filter_leads(client):
    for i in range(3):
        client.post(
            "/api/leads",
            json={
                "name": f"User {i}",
                "email": f"user{i}@example.com",
                "message": "hello",
                "source": "website",
            },
        )

    all_leads = client.get("/api/leads").json()
    assert len(all_leads) == 3

    pending = client.get("/api/leads?status=pending").json()
    assert len(pending) == 3

    qualified = client.get("/api/leads?status=qualified").json()
    assert len(qualified) == 0


def test_patch_lead_preserves_other_fields(client):
    create = client.post(
        "/api/leads",
        json={
            "name": "Patch Test",
            "email": "patch@example.com",
            "message": "hello",
            "source": "website",
        },
    ).json()
    lead_id = create["id"]

    client.patch(f"/api/leads/{lead_id}", json={"priority": "high"})
    patched = client.get(f"/api/leads/{lead_id}").json()
    assert patched["priority"] == "high"
    assert patched["status"] == "pending"