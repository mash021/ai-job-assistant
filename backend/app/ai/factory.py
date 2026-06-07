"""
AI provider factory.

Selects and returns the concrete `AIProvider` implementation based on the
`AI_PROVIDER` environment variable (exposed via `settings.AI_PROVIDER`).

This is the single place the rest of the app uses to obtain a provider, so
swapping implementations never requires touching business logic — only config.
"""

from __future__ import annotations

from app.ai.base import AIProvider
from app.ai.claude_provider import ClaudeProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.openai_provider import OpenAIProvider
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Registry mapping the configured name -> provider class.
# Add new providers here as they are implemented.
_PROVIDERS: dict[str, type[AIProvider]] = {
    "mock": MockAIProvider,
    "openai": OpenAIProvider,
    "claude": ClaudeProvider,
}


class UnknownProviderError(ValueError):
    """Raised when AI_PROVIDER is set to an unrecognized value."""


def get_ai_provider(name: str | None = None) -> AIProvider:
    """
    Return an instance of the configured AI provider.

    Args:
        name: Optional explicit provider name. Defaults to `settings.AI_PROVIDER`.

    Raises:
        UnknownProviderError: if the name is not a registered provider.
    """
    provider_name = (name or settings.AI_PROVIDER or "mock").strip().lower()

    provider_cls = _PROVIDERS.get(provider_name)
    if provider_cls is None:
        valid = ", ".join(sorted(_PROVIDERS))
        raise UnknownProviderError(
            f"Unknown AI provider '{provider_name}'. Valid options: {valid}."
        )

    logger.debug("Using AI provider: %s", provider_name)
    return provider_cls()
