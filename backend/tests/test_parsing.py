"""Unit tests for the file parsing service."""

import pytest

from app.services.parsing import (
    UnsupportedFileTypeError,
    extract_text,
)


def test_extract_plain_text():
    data = b"Hello world\n\nPython developer"
    text = extract_text("resume.txt", "text/plain", data)
    assert "Hello world" in text
    assert "Python developer" in text


def test_cleans_blank_lines():
    data = b"line one\n\n\n   \nline two"
    text = extract_text("resume.txt", "text/plain", data)
    # Blank/whitespace-only lines are collapsed.
    assert text == "line one\nline two"


def test_unsupported_extension_raises():
    with pytest.raises(UnsupportedFileTypeError):
        extract_text("resume.docx", "application/msword", b"data")


def test_tolerates_bad_utf8():
    # A stray non-UTF8 byte should not crash extraction.
    data = b"Valid text \xff and more"
    text = extract_text("resume.txt", "text/plain", data)
    assert "Valid text" in text
