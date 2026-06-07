"""
AI Job Assistant — Backend entry point.

This is intentionally minimal for Epic 1 (Infrastructure & DevOps Foundation).
It only exposes a `/health` endpoint so we can verify that:
  - the FastAPI app boots correctly inside Docker, and
  - the frontend can successfully reach the backend over the network.

No business logic (resume parsing, AI providers, database access) lives here yet.
Those arrive in later epics.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# The FastAPI application instance. `title` and `version` show up in the
# auto-generated docs at /docs.
app = FastAPI(title="AI Job Assistant API", version="0.1.0")

# CORS (Cross-Origin Resource Sharing) lets the browser-based frontend
# (served from a different origin, e.g. http://localhost:3000) call this API.
# For Epic 1 we allow all origins to keep local development friction-free.
# This will be tightened to specific origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """
    Lightweight liveness probe.

    Returns a small JSON payload that the frontend (and tools like Docker
    health checks or uptime monitors) can use to confirm the API is up.
    """
    return {"status": "ok", "service": "ai-job-assistant-backend"}
