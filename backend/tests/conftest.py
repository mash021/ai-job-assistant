"""
Shared pytest fixtures.

The API tests run against an in-memory SQLite database instead of PostgreSQL, so
they need no external services and are fast and isolated. We:
  - create a fresh SQLite engine shared across the connection (StaticPool),
  - create all tables from the ORM metadata,
  - override the `get_db` dependency so the app uses the test session,
  - expose a `TestClient` for making HTTP requests.

This works because the model's JSON columns use a dialect-agnostic type that
renders as plain JSON on SQLite and JSONB on PostgreSQL.
"""

from __future__ import annotations

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Import base_all (as a name that does NOT shadow the FastAPI `app` instance)
# so Base.metadata knows about every model/table.
from app.ai.mock_provider import MockAIProvider
from app.db import base_all  # noqa: F401
from app.db.base import Base
from app.db.session import get_db
from app.main import app


@pytest.fixture(autouse=True)
def mock_ai_provider(monkeypatch: pytest.MonkeyPatch) -> None:
    """Keep API tests offline — never call real OpenAI/Claude during CI."""
    monkeypatch.setattr(
        "app.api.comparisons.get_ai_provider",
        lambda: MockAIProvider(),
    )


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provide a clean in-memory database session per test."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # keep one connection so the in-memory DB persists
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """TestClient whose DB dependency is wired to the test session."""

    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
