"""Unit tests for the keyword skill extractor."""

from app.services.skills import extract_skills


def test_detects_basic_skills():
    text = "Experienced Python developer skilled in FastAPI, Docker and PostgreSQL."
    assert extract_skills(text) == ["Docker", "FastAPI", "PostgreSQL", "Python"]


def test_matches_skill_before_period():
    # Regression: a skill at the end of a sentence must still match.
    assert "Kubernetes" in extract_skills("We use Kubernetes.")


def test_does_not_match_substring():
    # "java" must not match inside "javascript".
    skills = extract_skills("Strong JavaScript skills")
    assert "JavaScript" in skills
    assert "Java" not in skills


def test_node_js_does_not_trigger_javascript():
    # Regression: the "js" alias must not match the ".js" inside "Node.js".
    skills = extract_skills("Built services with Node.js and React.")
    assert "Node.js" in skills
    assert "React" in skills
    assert "JavaScript" not in skills


def test_handles_special_characters():
    assert "C++" in extract_skills("Experienced in C++ programming.")


def test_empty_text_returns_empty_list():
    assert extract_skills("") == []
    assert extract_skills("   ") == []


def test_results_are_sorted_and_unique():
    text = "python Python PYTHON docker Docker"
    result = extract_skills(text)
    assert result == sorted(result)
    assert len(result) == len(set(result))
