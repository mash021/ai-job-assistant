"""add summary to comparisons

Epic 6 migration. Adds the `summary` column that stores the AI provider's short
explanation of the analysis result.

Revision ID: 0003_add_summary
Revises: 0002_add_extracted_skills
Create Date: 2026-06-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0003_add_summary"
down_revision: Union[str, None] = "0002_add_extracted_skills"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("comparisons", sa.Column("summary", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("comparisons", "summary")
