"""Unit tests for the deterministic mock AI provider."""

from app.ai.mock_provider import MockAIProvider

RESUME = "Python developer with FastAPI and Docker experience."
JOB = "Seeking engineer skilled in Python, FastAPI, AWS and Kubernetes."


def test_returns_all_fields():
    result = MockAIProvider().analyze(RESUME, JOB)
    assert isinstance(result.score, int)
    assert result.provider == "mock"
    assert result.summary
    assert result.cover_letter
    assert isinstance(result.missing_skills, list)
    assert isinstance(result.matched_skills, list)


def test_is_deterministic():
    p = MockAIProvider()
    assert p.analyze(RESUME, JOB).to_dict() == p.analyze(RESUME, JOB).to_dict()


def test_score_within_bounds():
    score = MockAIProvider().analyze(RESUME, JOB).score
    assert 0 <= score <= 100


def test_missing_and_matched_skills():
    result = MockAIProvider().analyze(RESUME, JOB)
    # Python & FastAPI are in both; AWS & Kubernetes only in the job.
    assert "Python" in result.matched_skills
    assert "FastAPI" in result.matched_skills
    assert "AWS" in result.missing_skills
    assert "Kubernetes" in result.missing_skills


def test_neutral_score_without_job_skills():
    result = MockAIProvider().analyze("Some resume text", "A job with no known skills")
    assert result.score == 50
