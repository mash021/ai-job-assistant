"""
OpenAI provider — STUB.

Placeholder for the real OpenAI-backed implementation. Per Epic 5, no real API
calls are made yet. The class exists so the factory can recognize the "openai"
provider name and so the wiring/prompts are ready for Epic 6.

When implemented later, `analyze()` will:
  1. Render the prompt templates in `app/ai/prompts/` with the resume + job text.
  2. Call the OpenAI API using `settings.OPENAI_API_KEY`.
  3. Parse the model's response into an `AnalysisResult`.
"""

from __future__ import annotations

from app.ai.base import AIProvider, AnalysisResult


class OpenAIProvider(AIProvider):
    name = "openai"

    def analyze(
        self, resume_text: str, job_description_text: str
    ) -> AnalysisResult:
        # Intentionally not implemented in Epic 5. Real API integration arrives
        # in Epic 6. Until then, use AI_PROVIDER=mock for local development.
        raise NotImplementedError(
            "The OpenAI provider is not implemented yet (Epic 6). "
            "Set AI_PROVIDER=mock to use the deterministic mock provider."
        )
