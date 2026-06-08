"""
Comparisons API router.

Flow (Epic 4 + Epic 6):
  1. Accept a resume file upload + a job description (multipart/form-data).
  2. Extract clean text and detect skills via keyword matching (Epic 4).
  3. Run the configured AI provider to produce score, missing skills, summary,
     and a cover letter (Epic 6 — uses the deterministic MockAIProvider).
  4. Persist everything to the `comparisons` table and return the full result.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from openai import APIConnectionError, AuthenticationError, RateLimitError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.factory import UnknownProviderError, get_ai_provider
from app.ai.openai_provider import OpenAIConfigurationError
from app.core.logging import get_logger
from app.db.session import get_db
from app.models.comparison import Comparison
from app.schemas.comparison import (
    ComparisonListItem,
    ComparisonRead,
    DeleteResponse,
)
from app.services.parsing import (
    ALLOWED_EXTENSIONS,
    FileParseError,
    UnsupportedFileTypeError,
    extract_text,
)
from app.services.skills import extract_skills

logger = get_logger(__name__)

router = APIRouter(prefix="/api/comparisons", tags=["comparisons"])

# Validation limits. Generous enough for real resumes, strict enough to reject
# empty input or accidental huge uploads.
MAX_FILE_BYTES = 5 * 1024 * 1024  # 5 MB
MIN_JOB_DESCRIPTION_CHARS = 30
MAX_JOB_DESCRIPTION_CHARS = 20_000
MIN_RESUME_CHARS = 30


@router.post("", response_model=ComparisonRead, status_code=status.HTTP_201_CREATED)
async def create_comparison(
    resume: UploadFile = File(..., description="Resume file (.pdf or .txt)"),
    job_description: str = Form(..., description="Job description text"),
    db: Session = Depends(get_db),
) -> Comparison:
    """
    Parse a resume + job description, run AI analysis, and save the result.

    Steps:
      1. Validate the job description length.
      2. Validate the file extension and size.
      3. Extract clean text from the file.
      4. Detect skills in both the resume and the job description.
      5. Run the configured AI provider (mock) for score/skills/cover letter.
      6. Persist a new Comparison row and return the full result.
    """
    # --- 1. Validate the job description text ---
    job_text = (job_description or "").strip()
    if len(job_text) < MIN_JOB_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Job description is too short "
                f"(minimum {MIN_JOB_DESCRIPTION_CHARS} characters)."
            ),
        )
    if len(job_text) > MAX_JOB_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Job description is too long "
                f"(maximum {MAX_JOB_DESCRIPTION_CHARS} characters)."
            ),
        )

    # --- 2. Validate the uploaded file type ---
    filename = resume.filename or ""
    if not any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unsupported file type. Upload a .pdf or .txt resume.",
        )

    # Read the file into memory and enforce a size limit.
    data = await resume.read()
    if len(data) == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded file is empty.",
        )
    if len(data) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="The uploaded file exceeds the 5 MB limit.",
        )

    # --- 3. Extract clean text from the file ---
    try:
        resume_text = extract_text(filename, resume.content_type, data)
    except UnsupportedFileTypeError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
    except FileParseError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc

    if len(resume_text) < MIN_RESUME_CHARS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Could not extract enough text from the resume. "
                "If it is a scanned/image PDF, try a text-based file."
            ),
        )

    # --- 4. Detect skills (keyword matching, not AI) ---
    extracted_skills = {
        "resume": extract_skills(resume_text),
        "job_description": extract_skills(job_text),
    }

    # --- 5. Run AI analysis (Epic 6) ---
    # The provider is chosen by AI_PROVIDER (mock by default). Any failure here
    # is surfaced as a clear error instead of saving a half-finished record.
    try:
        provider = get_ai_provider()
        result = provider.analyze(resume_text, job_text)
    except UnknownProviderError as exc:
        # Misconfiguration: AI_PROVIDER names a provider we don't know.
        logger.error("AI analysis failed (bad provider): %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc
    except NotImplementedError as exc:
        # A real provider (openai/claude) is selected but not implemented yet.
        logger.warning("AI analysis unavailable: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=str(exc)
        ) from exc
    except OpenAIConfigurationError as exc:
        logger.error("OpenAI not configured: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        ) from exc
    except AuthenticationError as exc:
        logger.error("OpenAI authentication failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid OPENAI_API_KEY. Check your .env file.",
        ) from exc
    except RateLimitError as exc:
        logger.error("OpenAI rate/quota limit: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "OpenAI quota exceeded. Add billing at platform.openai.com "
                "or set AI_PROVIDER=mock in .env to use the free mock provider."
            ),
        ) from exc
    except APIConnectionError as exc:
        logger.error("OpenAI connection error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach OpenAI. Check your internet connection.",
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive catch-all
        logger.exception("Unexpected AI analysis error")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI analysis failed. Please try again.",
        ) from exc

    # Store the matched skills alongside the extracted ones for easy display.
    extracted_skills["matched"] = result.matched_skills

    # --- 6. Persist the new comparison with AI results ---
    comparison = Comparison(
        resume_text=resume_text,
        job_description_text=job_text,
        extracted_skills=extracted_skills,
        score=result.score,
        missing_skills=result.missing_skills,
        summary=result.summary,
        cover_letter=result.cover_letter,
        provider=result.provider,
    )
    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    logger.info(
        "Saved comparison id=%s (provider=%s, score=%s, missing=%d)",
        comparison.id,
        result.provider,
        result.score,
        len(result.missing_skills),
    )

    return comparison


def _get_or_404(db: Session, comparison_id: int) -> Comparison:
    """Fetch a comparison by id or raise a 404 if it does not exist."""
    comparison = db.get(Comparison, comparison_id)
    if comparison is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comparison {comparison_id} not found.",
        )
    return comparison


@router.get("", response_model=list[ComparisonListItem])
def list_comparisons(db: Session = Depends(get_db)) -> list[Comparison]:
    """
    Return all saved comparisons, newest first.

    Uses the compact `ComparisonListItem` schema so the history list stays
    lightweight (no resume/job text or cover letter).
    """
    # Order by creation time, with id as a stable tiebreaker for records created
    # within the same timestamp resolution.
    stmt = select(Comparison).order_by(
        Comparison.created_at.desc(), Comparison.id.desc()
    )
    return list(db.scalars(stmt).all())


@router.get("/{comparison_id}", response_model=ComparisonRead)
def get_comparison(
    comparison_id: int, db: Session = Depends(get_db)
) -> Comparison:
    """Return the full saved comparison, or 404 if it does not exist."""
    return _get_or_404(db, comparison_id)


@router.delete("/{comparison_id}", response_model=DeleteResponse)
def delete_comparison(
    comparison_id: int, db: Session = Depends(get_db)
) -> DeleteResponse:
    """Delete one comparison by id. Returns 404 if it does not exist."""
    comparison = _get_or_404(db, comparison_id)
    db.delete(comparison)
    db.commit()
    logger.info("Deleted comparison id=%s", comparison_id)
    return DeleteResponse(deleted=True, id=comparison_id)
