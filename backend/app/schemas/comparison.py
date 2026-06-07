"""
Pydantic schemas for the Comparison resource.

These define the shape of data crossing the API boundary and are kept separate
from the ORM model (which is the database shape). Splitting them lets the API
contract evolve independently from the database and keeps validation explicit.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComparisonBase(BaseModel):
    """Fields shared by create/read schemas."""

    resume_text: str = Field(..., description="Raw text extracted from the resume")
    job_description_text: str = Field(
        ..., description="Raw text of the job description"
    )


class ComparisonCreate(ComparisonBase):
    """Payload accepted when creating a comparison (inputs only)."""

    pass


class ComparisonRead(ComparisonBase):
    """Full representation returned for create + detail views.

    Includes the raw inputs, AI results, and metadata.
    """

    # `from_attributes=True` lets Pydantic build this model directly from an
    # ORM object (e.g. ComparisonRead.model_validate(orm_obj)).
    model_config = ConfigDict(from_attributes=True)

    id: int
    # Keyword-detected skills. Keys: "resume", "job_description", and (after
    # analysis) "matched" — skills the job requires that the resume also has.
    extracted_skills: dict[str, list[str]] | None = None
    score: int | None = None
    missing_skills: list[str] | None = None
    summary: str | None = None
    cover_letter: str | None = None
    provider: str | None = None
    created_at: datetime


class ComparisonListItem(BaseModel):
    """Compact representation for the history list.

    Intentionally omits the heavy fields (`resume_text`, `job_description_text`,
    `cover_letter`) so the list endpoint stays lightweight. The detail endpoint
    returns the full `ComparisonRead`.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    score: int | None = None
    provider: str | None = None
    summary: str | None = None
    missing_skills: list[str] | None = None
    extracted_skills: dict[str, list[str]] | None = None
    created_at: datetime


class DeleteResponse(BaseModel):
    """Simple, typed confirmation returned by the delete endpoint."""

    deleted: bool = True
    id: int
    detail: str = "Comparison deleted."
