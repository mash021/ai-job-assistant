"""
AI provider interface and shared result type.

This defines the *contract* every AI provider must implement. Keeping the
interface separate from concrete providers (mock/openai/claude) means the rest
of the app depends only on this abstraction — providers can be swapped purely
via configuration.

Epic 5 scope: the interface plus a deterministic mock implementation. No real
external API calls are made here.
"""

from __future__ import annotations

import abc
from dataclasses import dataclass, field


@dataclass
class AnalysisResult:
    """
    The structured output of an AI analysis.

    These fields map directly onto the `Comparison` columns that later epics
    persist (score, missing_skills, cover_letter, provider) plus a short
    human-readable `summary`.
    """

    score: int                         # Match score, 0–100
    missing_skills: list[str]          # Skills in the job but missing from resume
    summary: str                       # Short explanation of the result
    cover_letter: str                  # Generated cover letter draft
    provider: str                      # Which provider produced this result
    matched_skills: list[str] = field(default_factory=list)  # Overlap (extra context)

    def to_dict(self) -> dict:
        """Convenience serializer for logging / API responses."""
        return {
            "score": self.score,
            "missing_skills": self.missing_skills,
            "matched_skills": self.matched_skills,
            "summary": self.summary,
            "cover_letter": self.cover_letter,
            "provider": self.provider,
        }


class AIProvider(abc.ABC):
    """
    Abstract base class for all AI providers.

    A provider takes the raw resume + job description text and returns an
    `AnalysisResult`. Implementations must be safe to instantiate cheaply; any
    heavy clients (HTTP sessions, SDKs) should be created lazily.
    """

    #: Human-readable provider name, e.g. "mock", "openai", "claude".
    name: str = "base"

    @abc.abstractmethod
    def analyze(self, resume_text: str, job_description_text: str) -> AnalysisResult:
        """
        Analyze a resume against a job description.

        Args:
            resume_text: Clean text extracted from the resume.
            job_description_text: The job description text.

        Returns:
            An `AnalysisResult` with score, missing skills, summary, and a
            cover letter draft.
        """
        raise NotImplementedError
