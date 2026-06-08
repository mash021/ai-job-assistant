"""Unit tests for the OpenAI provider (mocked — no real API calls)."""

from unittest.mock import MagicMock, patch

import pytest

from app.ai.openai_provider import OpenAIConfigurationError, OpenAIProvider

RESUME = "Python developer with FastAPI and Docker experience."
JOB = "Seeking engineer skilled in Python, FastAPI, AWS and Kubernetes."


def _choice(content: str) -> MagicMock:
    message = MagicMock()
    message.content = content
    choice = MagicMock()
    choice.message = message
    return choice


def _response(content: str) -> MagicMock:
    response = MagicMock()
    response.choices = [_choice(content)]
    return response


@patch("app.ai.openai_provider.settings")
@patch("app.ai.openai_provider.OpenAI")
def test_analyze_returns_structured_result(mock_openai_cls, mock_settings):
    mock_settings.OPENAI_API_KEY = "test-key"
    mock_settings.OPENAI_MODEL = "gpt-4o-mini"

    mock_client = MagicMock()
    mock_openai_cls.return_value = mock_client
    mock_client.chat.completions.create.side_effect = [
        _response("72"),
        _response('["AWS", "Kubernetes"]'),
        _response("Dear Hiring Manager,\n\nI am excited to apply.\n\nSincerely,\n[Your Name]"),
    ]

    result = OpenAIProvider().analyze(RESUME, JOB)

    assert result.provider == "openai"
    assert result.score == 72
    assert result.missing_skills == ["AWS", "Kubernetes"]
    assert "Python" in result.matched_skills
    assert "Dear Hiring Manager" in result.cover_letter
    assert mock_client.chat.completions.create.call_count == 3


@patch("app.ai.openai_provider.settings")
def test_requires_api_key(mock_settings):
    mock_settings.OPENAI_API_KEY = ""
    with pytest.raises(OpenAIConfigurationError):
        OpenAIProvider()
