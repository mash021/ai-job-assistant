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

/** Skills detected during parsing (Epic 4), grouped by source. */
export interface ExtractedSkills {
  resume: string[];
  job_description: string[];
}

/**
 * A Comparison as returned by the backend (mirrors the backend Pydantic
 * `ComparisonRead` schema). The AI result fields (`score`, `missing_skills`,
 * `cover_letter`) are filled in by later epics and are null after Epic 4.
 */
export interface Comparison {
  id: number;
  resume_text: string;
  job_description_text: string;
  extracted_skills: ExtractedSkills | null;
  score: number | null;
  missing_skills: string[] | null;
  cover_letter: string | null;
  provider: string | null;
  created_at: string;
}
