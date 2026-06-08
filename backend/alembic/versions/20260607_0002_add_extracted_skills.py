"""add extracted_skills to comparisons

Epic 4 migration. Adds the `extracted_skills` JSONB column used to store skills
detected by keyword matching during parsing.

Revision ID: 0002_add_extracted_skills
Revises: 0001_create_comparisons
Create Date: 2026-06-07

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0002_add_extracted_skills"
down_revision: str | None = "0001_create_comparisons"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "comparisons",
        sa.Column("extracted_skills", postgresql.JSONB(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("comparisons", "extracted_skills")
