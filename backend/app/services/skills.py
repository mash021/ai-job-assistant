"""
Basic skill keyword extraction.

This is intentionally simple for Epic 4: it matches text against a curated list
of well-known technical skills using word-boundary regular expressions. It does
NOT use AI and does NOT compute a match score or skill gap — it only reports
which known skills appear in a given piece of text.

Later epics replace/augment this with AI-based analysis.
"""

from __future__ import annotations

import re

# A small, curated dictionary of skills to look for. The key is the canonical
# label we store; the value is a list of aliases/spellings to match in text.
# Kept short on purpose — it is easy to extend later.
SKILL_ALIASES: dict[str, list[str]] = {
    "Python": ["python"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "react.js", "reactjs"],
    "Next.js": ["next.js", "nextjs"],
    "Node.js": ["node.js", "nodejs", "node"],
    "FastAPI": ["fastapi"],
    "Django": ["django"],
    "Flask": ["flask"],
    "SQL": ["sql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services"],
    "GCP": ["gcp", "google cloud"],
    "Azure": ["azure"],
    "Git": ["git"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration"],
    "REST": ["rest", "restful"],
    "GraphQL": ["graphql"],
    "HTML": ["html"],
    "CSS": ["css"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "Java": ["java"],
    "Go": ["golang", "go lang"],
    "C++": ["c++"],
    "Machine Learning": ["machine learning", "ml"],
    "Pandas": ["pandas"],
    "Linux": ["linux"],
}


def _build_pattern(alias: str) -> re.Pattern[str]:
    """
    Compile a case-insensitive, token-boundary pattern for one alias.

    `re.escape` keeps special characters (like the ++ in C++) literal. We use
    lookarounds instead of plain \\b so symbols such as "c++" still match.

    The boundaries reject characters that would make this a *different* token
    (letters, digits, +, #). A leading "." is also rejected so the "js" alias
    does not match inside "Node.js". A trailing "." IS allowed so a skill at the
    end of a sentence (e.g. "Kubernetes.") still matches.
    """
    escaped = re.escape(alias)
    return re.compile(rf"(?<![\w+#.]){escaped}(?![\w+#])", re.IGNORECASE)


# Pre-compile all alias patterns once at import time for efficiency.
_COMPILED: dict[str, list[re.Pattern[str]]] = {
    canonical: [_build_pattern(alias) for alias in aliases]
    for canonical, aliases in SKILL_ALIASES.items()
}


def extract_skills(text: str) -> list[str]:
    """
    Return the sorted list of known skills found in `text`.

    Matching is case-insensitive and respects word boundaries so, e.g., "java"
    does not match inside "javascript".
    """
    if not text:
        return []

    found: set[str] = set()
    for canonical, patterns in _COMPILED.items():
        if any(pattern.search(text) for pattern in patterns):
            found.add(canonical)

    return sorted(found)
