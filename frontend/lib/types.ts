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
 * Skills detected during parsing/analysis, grouped by source.
 *  - `resume` / `job_description`: keyword matches (Epic 4).
 *  - `matched`: job skills also present in the resume (added by analysis, Epic 6).
 */
export interface ExtractedSkills {
  resume: string[];
  job_description: string[];
  matched?: string[];
}

/**
 * A Comparison as returned by the backend (mirrors the backend Pydantic
 * `ComparisonRead` schema). After Epic 6 the AI result fields (`score`,
 * `missing_skills`, `summary`, `cover_letter`, `provider`) are populated.
 */
export interface Comparison {
  id: number;
  resume_text: string;
  job_description_text: string;
  extracted_skills: ExtractedSkills | null;
  score: number | null;
  missing_skills: string[] | null;
  summary: string | null;
  cover_letter: string | null;
  provider: string | null;
  created_at: string;
}
