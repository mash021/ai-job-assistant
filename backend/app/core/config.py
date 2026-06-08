"""
Application configuration.

All settings are read from environment variables (or an optional `.env` file),
so the same code runs unchanged across local Docker, local dev, and production.
We use `pydantic-settings`, which validates and type-casts the values for us.
"""

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Where to load env vars from when present. In Docker, real environment
    # variables (set by docker-compose) take precedence over any .env file.
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # ----- General -----
    PROJECT_NAME: str = "AI Job Assistant API"
    VERSION: str = "0.2.0"

    # ----- Database -----
    # Full SQLAlchemy/PostgreSQL connection string. The default matches the
    # `db` service defined in docker-compose.
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/ai_job_assistant"

    # ----- CORS -----
    # Comma-separated list of origins allowed to call the API from a browser.
    # "*" allows any origin (convenient for local development).
    BACKEND_CORS_ORIGINS: str = "*"

    # ----- AI provider -----
    AI_PROVIDER: str = "mock"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: str = ""

    # ----- Logging -----
    LOG_LEVEL: str = "INFO"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        """Railway/Render often provide postgres:// — SQLAlchemy needs postgresql://."""
        if isinstance(value, str) and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql://", 1)
        return value

    @property
    def cors_origins_list(self) -> list[str]:
        """Turn the comma-separated CORS string into a list for FastAPI."""
        if self.BACKEND_CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]


# A single, importable settings instance used across the app.
settings = Settings()
