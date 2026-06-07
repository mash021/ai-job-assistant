"""add extracted_skills to comparisons

Epic 4 migration. Adds the `extracted_skills` JSONB column used to store skills
detected by keyword matching during parsing.

Revision ID: 0002_add_extracted_skills
Revises: 0001_create_comparisons
Create Date: 2026-06-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0002_add_extracted_skills"
down_revision: Union[str, None] = "0001_create_comparisons"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "comparisons",
        sa.Column("extracted_skills", postgresql.JSONB(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("comparisons", "extracted_skills")
