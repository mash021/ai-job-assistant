"""
AI Job Assistant — Backend entry point.

Epic 2 (Backend Foundation) wires up the structural pieces of the API:
  - typed settings loaded from environment variables,
  - centralized logging,
  - CORS configured from settings,
  - the database layer (SQLAlchemy) is available via dependencies.

No business logic (resume parsing, AI providers, persistence endpoints) lives
here yet — only the `/health` endpoint, which now also reports basic readiness.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger, setup_logging

# Configure logging before anything else so startup messages are captured.
setup_logging()
logger = get_logger(__name__)

# The FastAPI application instance. Title/version show up at /docs.
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# CORS lets the browser-based frontend (a different origin, e.g.
# http://localhost:3000) call this API. Allowed origins come from settings so
# they can be locked down per environment without code changes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Log a small banner so we can confirm config at boot time."""
    logger.info("Starting %s v%s", settings.PROJECT_NAME, settings.VERSION)
    logger.info("AI provider configured as: %s", settings.AI_PROVIDER)


@app.get("/health")
def health_check():
    """
    Lightweight liveness probe.

    Returns a small JSON payload that the frontend (and tools like Docker
    health checks or uptime monitors) can use to confirm the API is up.
    """
    return {
        "status": "ok",
        "service": "ai-job-assistant-backend",
        "version": settings.VERSION,
    }
