def _create_lead(client):
    return client.post(
        "/api/leads",
        json={
            "name": "Exec Lead",
            "email": "exec@example.com",
            "message": "testing executions",
            "source": "api",
        },
    ).json()


def test_execution_lifecycle_success(client):
    lead = _create_lead(client)
    create = client.post(
        "/api/executions",
        json={
            "lead_id": lead["id"],
            "workflow_name": "Lead Intake & AI Qualification",
            "stage": "webhook_received",
        },
    )
    assert create.status_code == 201
    execution = create.json()
    assert execution["status"] == "running"
    assert execution["finished_at"] is None

    update = client.patch(
        f"/api/executions/{execution['id']}",
        json={"status": "success", "stage": "completed"},
    )
    assert update.status_code == 200
    updated = update.json()
    assert updated["status"] == "success"
    assert updated["finished_at"] is not None


def test_execution_failed_records_error(client):
    lead = _create_lead(client)
    execution = client.post(
        "/api/executions",
        json={
            "lead_id": lead["id"],
            "workflow_name": "Lead Intake & AI Qualification",
        },
    ).json()

    update = client.patch(
        f"/api/executions/{execution['id']}",
        json={
            "status": "failed",
            "stage": "ollama_call",
            "error_message": "Connection refused",
        },
    )
    assert update.status_code == 200
    updated = update.json()
    assert updated["status"] == "failed"
    assert updated["error_message"] == "Connection refused"
    assert updated["finished_at"] is not None


def test_cannot_reopen_finished_execution(client):
    lead = _create_lead(client)
    execution = client.post(
        "/api/executions",
        json={
            "lead_id": lead["id"],
            "workflow_name": "Lead Intake & AI Qualification",
        },
    ).json()

    client.patch(
        f"/api/executions/{execution['id']}",
        json={"status": "success"},
    )
    reopen = client.patch(
        f"/api/executions/{execution['id']}",
        json={"status": "running"},
    )
    assert reopen.status_code == 409


def test_list_executions_with_filters(client):
    lead = _create_lead(client)
    for _ in range(2):
        client.post(
            "/api/executions",
            json={"lead_id": lead["id"], "workflow_name": "A"},
        )
    success_exec = client.post(
        "/api/executions",
        json={"lead_id": lead["id"], "workflow_name": "A"},
    ).json()
    client.patch(
        f"/api/executions/{success_exec['id']}",
        json={"status": "success"},
    )

    all_execs = client.get("/api/executions").json()
    assert len(all_execs) == 3

    success_only = client.get("/api/executions?status=success").json()
    assert len(success_only) == 1

    by_lead = client.get(f"/api/executions?lead_id={lead['id']}").json()
    assert len(by_lead) == 3