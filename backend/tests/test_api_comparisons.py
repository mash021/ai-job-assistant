"""
Integration tests for the comparisons API.

These exercise the full request path (validation → parsing → mock AI → DB) using
the in-memory SQLite database and FastAPI's TestClient.
"""

JOB = "We need a backend engineer with Python, FastAPI, AWS and Kubernetes experience."


def _create(client, resume: bytes = None, job: str = JOB):
    """Helper to POST a comparison with a text resume."""
    resume = resume if resume is not None else (
        b"Experienced Python developer skilled in FastAPI, Docker and PostgreSQL."
    )
    return client.post(
        "/api/comparisons",
        files={"resume": ("resume.txt", resume, "text/plain")},
        data={"job_description": job},
    )


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_create_comparison_runs_analysis(client):
    res = _create(client)
    assert res.status_code == 201
    body = res.json()
    assert body["id"] > 0
    assert body["provider"] == "mock"
    assert isinstance(body["score"], int)
    assert body["summary"]
    assert body["cover_letter"]
    # Skills detected and matched/missing computed.
    assert "Python" in body["extracted_skills"]["matched"]
    assert "AWS" in body["missing_skills"]


def test_create_rejects_short_job_description(client):
    res = _create(client, job="too short")
    assert res.status_code == 422


def test_create_rejects_unsupported_file_type(client):
    res = client.post(
        "/api/comparisons",
        files={"resume": ("resume.docx", b"data", "application/msword")},
        data={"job_description": JOB},
    )
    assert res.status_code == 422


def test_create_rejects_empty_file(client):
    res = _create(client, resume=b"")
    assert res.status_code == 422


def test_list_returns_created_items_newest_first(client):
    first = _create(client).json()
    second = _create(client).json()

    res = client.get("/api/comparisons")
    assert res.status_code == 200
    items = res.json()
    assert len(items) == 2
    # Newest first.
    assert items[0]["id"] == second["id"]
    assert items[1]["id"] == first["id"]
    # Compact list omits heavy fields.
    assert "resume_text" not in items[0]
    assert "cover_letter" not in items[0]


def test_get_detail_returns_full_record(client):
    created = _create(client).json()
    res = client.get(f"/api/comparisons/{created['id']}")
    assert res.status_code == 200
    body = res.json()
    assert body["resume_text"]
    assert body["job_description_text"]
    assert body["cover_letter"]


def test_get_missing_returns_404(client):
    res = client.get("/api/comparisons/999999")
    assert res.status_code == 404


def test_delete_then_404(client):
    created = _create(client).json()
    res = client.delete(f"/api/comparisons/{created['id']}")
    assert res.status_code == 200
    assert res.json()["deleted"] is True

    # Deleting again should now 404.
    res2 = client.delete(f"/api/comparisons/{created['id']}")
    assert res2.status_code == 404


def test_delete_missing_returns_404(client):
    res = client.delete("/api/comparisons/999999")
    assert res.status_code == 404
