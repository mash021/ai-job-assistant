"""Unit tests for LLM response parsing helpers."""

import pytest

from app.ai.response_parsing import parse_score, parse_skill_list


def test_parse_score():
    assert parse_score("75") == 75
    assert parse_score("Score: 82/100") == 82


def test_parse_score_clamps():
    assert parse_score("150") == 100


def test_parse_skill_list():
    assert parse_skill_list('["AWS", "Kubernetes"]') == ["AWS", "Kubernetes"]


def test_parse_skill_list_with_markdown_fence():
    assert parse_skill_list('```json\n["GraphQL"]\n```') == ["GraphQL"]


def test_parse_score_invalid():
    with pytest.raises(ValueError):
        parse_score("no number here")
