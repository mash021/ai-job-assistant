"""
Database engine and session management.

- `engine` is the single connection pool to PostgreSQL.
- `SessionLocal` is a factory that produces short-lived Session objects.
- `get_db` is a FastAPI dependency that yields a session per request and
  guarantees it is closed afterwards.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# `pool_pre_ping` checks connections before using them, avoiding errors from
# stale connections (e.g. after the database container restarts).
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# `autoflush=False` keeps behavior explicit; we commit when we mean to.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Usage in an endpoint:
        def handler(db: Session = Depends(get_db)): ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
