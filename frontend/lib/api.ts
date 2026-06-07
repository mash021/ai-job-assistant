/**
 * Thin API client wrapper around `fetch`.
 *
 * Goals:
 *  - One place that knows the backend base URL and how to build requests.
 *  - Consistent error handling: non-2xx responses throw an `ApiError` so
 *    callers can show friendly messages.
 *  - Typed helpers per endpoint (e.g. `getHealth`) so components stay simple.
 *
 * No business logic lives here — only transport concerns.
 */

import { BACKEND_URL } from "./config";
import type {
  Comparison,
  ComparisonListItem,
  DeleteResponse,
  HealthResponse,
} from "./types";

/** Error thrown when the backend responds with a non-success status. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Core request helper. Prefixes the backend URL, sets JSON headers, parses the
 * JSON body, and converts failures into a thrown `ApiError`.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  } catch (err) {
    // Network-level failure (backend down, CORS, DNS, etc.).
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

/** Backend liveness probe: `GET /health`. */
export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

/**
 * Create a comparison by uploading a resume file + job description text.
 *
 * Uses `FormData` (multipart) so the file is transmitted correctly. We must NOT
 * set the `Content-Type` header manually here — the browser sets it (including
 * the multipart boundary) automatically.
 *
 * On validation failure the backend returns a `{ detail: string }` body, which
 * we surface as the `ApiError` message so the UI can show it directly.
 */
export async function createComparison(
  resumeFile: File,
  jobDescription: string,
): Promise<Comparison> {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("job_description", jobDescription);

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/comparisons`, {
      method: "POST",
      body: form,
    });
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : "Network request failed",
      0,
    );
  }

  if (!response.ok) {
    // FastAPI puts human-readable validation errors in `detail`.
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // Ignore JSON parse issues; keep the generic message.
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as Comparison;
}

/** List all saved comparisons (compact items), newest first. */
export function listComparisons(): Promise<ComparisonListItem[]> {
  return request<ComparisonListItem[]>("/api/comparisons");
}

/** Fetch a single full comparison by id. Throws `ApiError` (404) if missing. */
export function getComparison(id: number): Promise<Comparison> {
  return request<Comparison>(`/api/comparisons/${id}`);
}

/** Delete a comparison by id. */
export function deleteComparison(id: number): Promise<DeleteResponse> {
  return request<DeleteResponse>(`/api/comparisons/${id}`, {
    method: "DELETE",
  });
}

// Export the client as a small namespace object for ergonomic imports
// (e.g. `import { api } from "@/lib/api"; api.getHealth()`).
export const api = {
  getHealth,
  createComparison,
  listComparisons,
  getComparison,
  deleteComparison,
};
