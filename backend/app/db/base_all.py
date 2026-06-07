"""
Single import point that pulls in every ORM model.

Alembic imports this module so that `Base.metadata` is fully populated with all
tables before it compares the models against the database. Whenever you add a
new model, import it here too.
"""

from app.db.base import Base  # noqa: F401  (re-exported for Alembic)
from app.models.comparison import Comparison  # noqa: F401
