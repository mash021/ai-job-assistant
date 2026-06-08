"""Settings normalization tests."""

from app.core.config import Settings


def test_normalizes_postgres_scheme():
    settings = Settings(DATABASE_URL="postgres://user:pass@host:5432/db")
    assert settings.DATABASE_URL.startswith("postgresql://")
