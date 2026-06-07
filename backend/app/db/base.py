"""
Declarative base for all ORM models.

Every model inherits from `Base`. Alembic also imports this module (via
`app.db.base_all`) so that `Base.metadata` knows about every table when it
autogenerates migrations.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared SQLAlchemy declarative base class."""

    pass
