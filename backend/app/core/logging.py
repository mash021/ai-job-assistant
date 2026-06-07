"""
Basic application logging.

Keeps logging simple and centralized: one helper that configures the root
logger with a readable format and the level taken from settings. Call
`setup_logging()` once at startup.
"""

import logging

from app.core.config import settings


def setup_logging() -> None:
    """Configure root logging format and level (idempotent enough for dev)."""
    logging.basicConfig(
        level=settings.LOG_LEVEL.upper(),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def get_logger(name: str) -> logging.Logger:
    """Convenience wrapper so modules can grab a named logger consistently."""
    return logging.getLogger(name)
