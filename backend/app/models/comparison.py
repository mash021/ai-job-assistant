"""
Comparison ORM model.

A `Comparison` represents one analysis: a resume compared against a job
description, along with the AI-produced results. For Epic 2 we only define the
table/schema — no endpoints write to it yet. The AI fields are nullable because
they are populated later (Epic 5/6) once the analysis pipeline exists.
"""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Comparison(Base):
    __tablename__ = "comparisons"

    # Primary key.
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # ----- Inputs -----
    resume_text: Mapped[str] = mapped_column(Text, nullable=False)
    job_description_text: Mapped[str] = mapped_column(Text, nullable=False)

    # ----- AI results (filled in by later epics) -----
    # Match score from 0–100.
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # List of skills present in the job but missing from the resume.
    # Stored as JSONB so PostgreSQL can index/query it efficiently.
    missing_skills: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    # The generated cover letter text.
    cover_letter: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Which AI provider produced the result (mock/openai/claude).
    provider: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # ----- Metadata -----
    # `server_default=func.now()` lets the database set the timestamp on insert.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
