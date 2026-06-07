"""
Comparisons API router.

Epic 4 scope: accept a resume file upload + a job description, extract clean
text, detect skills via keyword matching, and persist everything to the
`comparisons` table. That's it — no match score, no cover letter, no AI.

The endpoint uses multipart/form-data because it carries a file plus text.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db.session import get_db
from app.models.comparison import Comparison
from app.schemas.comparison import ComparisonRead
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
    Parse a resume + job description and save the raw inputs and detected skills.

    Steps:
      1. Validate the job description length.
      2. Validate the file extension and size.
      3. Extract clean text from the file.
      4. Detect skills in both the resume and the job description.
      5. Persist a new Comparison row and return it.
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

    # --- 5. Persist the new comparison ---
    comparison = Comparison(
        resume_text=resume_text,
        job_description_text=job_text,
        extracted_skills=extracted_skills,
    )
    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    logger.info(
        "Saved comparison id=%s (resume_skills=%d, job_skills=%d)",
        comparison.id,
        len(extracted_skills["resume"]),
        len(extracted_skills["job_description"]),
    )

    return comparison
