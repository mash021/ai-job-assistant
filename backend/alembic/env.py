"""
Alembic migration environment.

This wires Alembic to our application so that:
  - the database URL comes from app settings (env vars), and
  - autogenerate sees every model via `Base.metadata`.
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# Import settings and the metadata that knows about all models.
from app.core.config import settings
from app.db.base_all import Base  # noqa: F401  (ensures all models are imported)

# Alembic Config object (provides access to values in alembic.ini).
config = context.config

# Inject the application's DATABASE_URL so migrations target the same database.
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Configure Python logging from the alembic.ini file.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata used for 'autogenerate' support.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (emits SQL)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations against a live database connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
