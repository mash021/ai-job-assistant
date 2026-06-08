"""Parse structured fragments from LLM text responses."""

from __future__ import annotations

import json
import re


def parse_score(text: str) -> int:
    """Extract an integer score (0–100) from model output."""
    match = re.search(r"\b(\d{1,3})\b", text.strip())
    if not match:
        raise ValueError(f"Could not parse score from: {text!r}")
    return max(0, min(100, int(match.group(1))))


def parse_skill_list(text: str) -> list[str]:
    """Parse a JSON array of skill strings, tolerating markdown fences."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    data = json.loads(cleaned)
    if not isinstance(data, list):
        raise ValueError("Skill gap response must be a JSON array.")

    return [str(skill).strip() for skill in data if str(skill).strip()]
