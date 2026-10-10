def _create_lead(client, email="eval@example.com"):
    return client.post(
        "/api/leads",
        json={
            "name": "Eval Lead",
            "email": email,
            "message": "We need a custom web application with an $8,000 budget.",
            "source": "website",
        },
    ).json()


def test_evaluate_returns_expected_classification(client):
    lead = _create_lead(client)
    response = client.post(
        f"/api/leads/{lead['id']}/evaluate",
        json={
            "summary": "Custom web application",
            "category": "web_development",
            "budget_usd": 8000,
            "urgency": "high",
            "model": "llama3.2",
            "has_valid_contact": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["priority"] == "high"
    assert data["status"] == "qualified"
    assert data["lead_id"] == lead["id"]
    assert isinstance(data["reasons"], list)

    updated = client.get(f"/api/leads/{lead['id']}").json()
    assert updated["status"] == "qualified"
    assert updated["priority"] == "high"


def test_evaluate_is_idempotent(client):
    lead = _create_lead(client, email="idem@example.com")
    payload = {
        "summary": "Automation project",
        "category": "automation",
        "budget_usd": 6000,
        "urgency": "high",
        "model": "llama3.2",
        "has_valid_contact": True,
    }

    first = client.post(f"/api/leads/{lead['id']}/evaluate", json=payload).json()
    second = client.post(f"/api/leads/{lead['id']}/evaluate", json=payload).json()

    assert first["analysis_id"] == second["analysis_id"]


def test_evaluate_unknown_lead_returns_404(client):
    response = client.post(
        "/api/leads/00000000-0000-0000-0000-000000000000/evaluate",
        json={
            "summary": "x",
            "category": "other",
            "budget_usd": None,
            "urgency": "low",
            "has_valid_contact": True,
        },
    )
    assert response.status_code == 404


def test_evaluate_rejects_incomplete_payload(client):
    lead = _create_lead(client, email="incomplete@example.com")
    response = client.post(
        f"/api/leads/{lead['id']}/evaluate",
        json={"summary": "only summary"},
    )
    assert response.status_code == 422