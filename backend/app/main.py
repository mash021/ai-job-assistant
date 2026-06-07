"""
AI Job Assistant — Backend entry point.

Structural pieces wired up here:
  - typed settings loaded from environment variables (Epic 2),
  - centralized logging (Epic 2),
  - CORS configured from settings (Epic 2),
  - the database layer via dependencies (Epic 2),
  - the comparisons router for upload + parsing (Epic 4),
  - AI provider selection validated at startup (Epic 5).

The AI provider is only *selected/validated* here; it is not yet invoked by any
endpoint (that happens in Epic 6). Use `AI_PROVIDER=mock` for local development.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai.factory import UnknownProviderError, get_ai_provider
from app.api import comparisons
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
    """Log a small banner and validate the configured AI provider at boot."""
    logger.info("Starting %s v%s", settings.PROJECT_NAME, settings.VERSION)

    # Resolve the AI provider early so a misconfigured AI_PROVIDER surfaces as a
    # clear log message instead of failing later mid-request. We don't crash the
    # app — /health and parsing endpoints stay usable.
    try:
        provider = get_ai_provider()
        logger.info("AI provider ready: %s", provider.name)
    except UnknownProviderError as exc:
        logger.error("AI provider misconfigured: %s", exc)


# Register feature routers. The comparisons router (Epic 4) handles resume +
# job-description intake, parsing, and persistence.
app.include_router(comparisons.router)


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
