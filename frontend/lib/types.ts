/**
 * Shared TypeScript types for the frontend.
 *
 * These describe the data shapes the UI works with — primarily the responses
 * returned by the backend API. Keeping them in one place means components and
 * the API client agree on the same contract.
 */

/** Response shape of the backend `GET /health` endpoint. */
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

/**
 * A Comparison as returned by the backend (mirrors the backend Pydantic
 * `ComparisonRead` schema). Defined now for forward-compatibility; the AI
 * result fields are filled in by later epics and may be null until then.
 */
export interface Comparison {
  id: number;
  resume_text: string;
  job_description_text: string;
  score: number | null;
  missing_skills: string[] | null;
  cover_letter: string | null;
  provider: string | null;
  created_at: string;
}
