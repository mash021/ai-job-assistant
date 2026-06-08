"""Unit tests for the AI provider factory."""

import pytest

from app.ai.claude_provider import ClaudeProvider
from app.ai.factory import UnknownProviderError, get_ai_provider
from app.ai.mock_provider import MockAIProvider
from app.ai.openai_provider import OpenAIProvider


def test_returns_mock_provider():
    assert isinstance(get_ai_provider("mock"), MockAIProvider)


def test_case_insensitive_selection():
    assert isinstance(get_ai_provider("MOCK"), MockAIProvider)


def test_returns_stub_providers():
    assert isinstance(get_ai_provider("openai"), OpenAIProvider)
    assert isinstance(get_ai_provider("claude"), ClaudeProvider)


def test_unknown_provider_raises():
    with pytest.raises(UnknownProviderError):
        get_ai_provider("does-not-exist")


def test_stub_providers_not_implemented():
    with pytest.raises(NotImplementedError):
        get_ai_provider("openai").analyze("resume", "job")
