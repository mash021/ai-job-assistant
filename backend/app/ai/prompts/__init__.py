"""
Prompt template loader.

Prompt text lives in plain `.txt` files in this directory so they can be edited
without touching Python code. Real providers (Epic 6) load a template and fill
in `{resume_text}` / `{job_description_text}` placeholders via `render()`.

The mock provider does NOT use these templates — it is fully self-contained.
"""

from __future__ import annotations

from pathlib import Path

# Directory containing the .txt prompt templates (this package's folder).
_PROMPTS_DIR = Path(__file__).parent


def load_prompt(name: str) -> str:
    """
    Load a prompt template by filename (without extension).

    Example: `load_prompt("cover_letter")` reads `cover_letter.txt`.
    """
    path = _PROMPTS_DIR / f"{name}.txt"
    if not path.exists():
        raise FileNotFoundError(f"Prompt template not found: {path.name}")
    return path.read_text(encoding="utf-8")


def render(name: str, **values: str) -> str:
    """Load a template and substitute `{placeholder}` values."""
    template = load_prompt(name)
    return template.format(**values)
