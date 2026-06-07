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
import type { HealthResponse } from "./types";

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

// Export the client as a small namespace object for ergonomic imports
// (e.g. `import { api } from "@/lib/api"; api.getHealth()`).
export const api = {
  getHealth,
};
