"""
File parsing service.

Turns an uploaded resume file (PDF or plain text) into clean, usable text.
This module is deliberately small and dependency-light: it only extracts text.
No AI or scoring logic lives here.

Supported types:
  - PDF  (.pdf)  -> text extracted with pypdf
  - Text (.txt)  -> decoded as UTF-8 (with a tolerant fallback)
"""

from __future__ import annotations

import io

from pypdf import PdfReader

# Allowed upload extensions and their matching MIME types. Used for validation
# at the API layer and to choose the right extraction strategy here.
ALLOWED_EXTENSIONS = {".pdf", ".txt"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "text/plain",
}


class UnsupportedFileTypeError(Exception):
    """Raised when an uploaded file is neither PDF nor plain text."""


class FileParseError(Exception):
    """Raised when a file looks valid but its contents cannot be read."""


def _clean(text: str) -> str:
    """Normalize whitespace so downstream matching is more reliable."""
    # Collapse runs of blank lines and trim trailing spaces on each line.
    lines = [line.strip() for line in text.splitlines()]
    non_empty = [line for line in lines if line]
    return "\n".join(non_empty).strip()


def _extract_pdf(data: bytes) -> str:
    """Extract text from a PDF byte stream, page by page."""
    try:
        reader = PdfReader(io.BytesIO(data))
        pages = [page.extract_text() or "" for page in reader.pages]
    except Exception as exc:  # pragma: no cover - defensive
        raise FileParseError(f"Could not read PDF: {exc}") from exc
    return _clean("\n".join(pages))


def _extract_txt(data: bytes) -> str:
    """Decode a plain-text byte stream as UTF-8 (lossy fallback if needed)."""
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        # Some text files use other encodings; don't fail hard on a stray byte.
        text = data.decode("utf-8", errors="ignore")
    return _clean(text)


def extract_text(filename: str, content_type: str | None, data: bytes) -> str:
    """
    Extract clean text from uploaded file bytes.

    Decides the strategy based on the file extension (primary) and falls back to
    the declared content type. Raises `UnsupportedFileTypeError` for anything
    that is not a PDF or text file.
    """
    name = (filename or "").lower()

    if name.endswith(".pdf") or content_type == "application/pdf":
        return _extract_pdf(data)

    if name.endswith(".txt") or content_type in {"text/plain", None}:
        return _extract_txt(data)

    raise UnsupportedFileTypeError(
        "Only PDF (.pdf) and plain text (.txt) resumes are supported."
    )
