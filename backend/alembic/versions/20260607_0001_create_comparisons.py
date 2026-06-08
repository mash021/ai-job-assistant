"""create comparisons table

Initial migration for Epic 2. Creates the `comparisons` table that mirrors the
`Comparison` ORM model. AI result columns are nullable because they are filled
in by later epics.

Revision ID: 0001_create_comparisons
Revises:
Create Date: 2026-06-07

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_create_comparisons"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "comparisons",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("resume_text", sa.Text(), nullable=False),
        sa.Column("job_description_text", sa.Text(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("missing_skills", postgresql.JSONB(), nullable=True),
        sa.Column("cover_letter", sa.Text(), nullable=True),
        sa.Column("provider", sa.String(length=50), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_comparisons_id"), "comparisons", ["id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_comparisons_id"), table_name="comparisons")
    op.drop_table("comparisons")
