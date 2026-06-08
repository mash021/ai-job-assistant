"""
OpenAI provider.

Calls the OpenAI Chat Completions API using prompt templates from
`app/ai/prompts/`. Requires `OPENAI_API_KEY` in the environment.
"""

from __future__ import annotations

from openai import OpenAI

from app.ai.base import AIProvider, AnalysisResult
from app.ai.prompts import load_prompt, render
from app.ai.response_parsing import parse_score, parse_skill_list
from app.core.config import settings
from app.services.skills import extract_skills


class OpenAIConfigurationError(RuntimeError):
    """Raised when OpenAI is selected but not configured."""


class OpenAIProvider(AIProvider):
    name = "openai"

    def __init__(self) -> None:
        api_key = (settings.OPENAI_API_KEY or "").strip()
        if not api_key:
            raise OpenAIConfigurationError(
                "OPENAI_API_KEY is not set. Add it to .env or set AI_PROVIDER=mock."
            )
        self._client = OpenAI(api_key=api_key)
        self._model = settings.OPENAI_MODEL

    def analyze(
        self, resume_text: str, job_description_text: str
    ) -> AnalysisResult:
        context = {
            "resume_text": resume_text,
            "job_description_text": job_description_text,
        }

        score = parse_score(
            self._complete(render("match_score", **context))
        )
        missing_skills = parse_skill_list(
            self._complete(render("skill_gap", **context))
        )
        cover_letter = self._complete(render("cover_letter", **context))

        resume_skills = set(extract_skills(resume_text))
        job_skills = set(extract_skills(job_description_text))
        matched_skills = sorted(job_skills & resume_skills)

        summary = self._build_summary(score, matched_skills, missing_skills)

        return AnalysisResult(
            score=score,
            missing_skills=missing_skills,
            matched_skills=matched_skills,
            summary=summary,
            cover_letter=cover_letter,
            provider=self.name,
        )

    def _complete(self, user_prompt: str) -> str:
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": load_prompt("system")},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("OpenAI returned an empty response.")
        return content.strip()

    @staticmethod
    def _build_summary(
        score: int, matched: list[str], missing: list[str]
    ) -> str:
        if score >= 80:
            verdict = "strong match"
        elif score >= 50:
            verdict = "partial match"
        else:
            verdict = "weak match"

        matched_str = ", ".join(matched) if matched else "limited named overlap"
        missing_str = ", ".join(missing) if missing else "no major gaps identified"

        return (
            f"This resume is a {verdict} for the role (AI score {score}/100). "
            f"Matched skills: {matched_str}. "
            f"Skills to highlight or develop: {missing_str}."
        )
