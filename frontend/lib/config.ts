/**
 * Frontend runtime configuration.
 *
 * `NEXT_PUBLIC_` variables are inlined into the browser bundle at build time.
 * We centralize them here so every module reads config from one place instead
 * of scattering `process.env` lookups across the app.
 */

// Base URL of the backend API. Defaults to localhost so the app also works
// when run outside Docker.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
