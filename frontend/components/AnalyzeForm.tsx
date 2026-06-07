"use client";

/**
 * Resume + job description intake form (Epic 4 + Epic 6).
 *
 * Responsibilities:
 *  - Let the user pick a resume file (.pdf or .txt).
 *  - Let the user paste a job description.
 *  - Submit both to the backend, which parses, runs AI analysis, and saves.
 *  - Show loading and error states.
 *  - On success, render the full analysis (score, skills, cover letter).
 */

import { useState } from "react";

import { AnalysisResult } from "@/components/AnalysisResult";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { api, ApiError } from "@/lib/api";
import type { Comparison } from "@/lib/types";

// Client-side mirror of the backend's accepted file types, for early feedback.
const ACCEPTED_EXTENSIONS = [".pdf", ".txt"];
const MIN_JOB_CHARS = 30;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; result: Comparison }
  | { kind: "error"; message: string };

export function AnalyzeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const jobTooShort = jobDescription.trim().length < MIN_JOB_CHARS;
  const canSubmit = file !== null && !jobTooShort && status.kind !== "submitting";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;

    setStatus({ kind: "submitting" });
    try {
      const result = await api.createComparison(file, jobDescription.trim());
      setStatus({ kind: "success", result });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unexpected error. Please retry.";
      setStatus({ kind: "error", message });
    }
  }

  function resetForm() {
    setFile(null);
    setJobDescription("");
    setStatus({ kind: "idle" });
  }

  // After a successful analysis, show the result instead of the form.
  if (status.kind === "success") {
    return (
      <Card title="Analysis result">
        <AnalysisResult result={status.result} onReset={resetForm} />
      </Card>
    );
  }

  return (
    <Card title="Analyze a resume against a job">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Resume file picker */}
        <div className="space-y-1.5">
          <label htmlFor="resume" className="block text-sm font-medium">
            Resume file <span className="text-slate-400">(.pdf or .txt)</span>
          </label>
          <input
            id="resume"
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
          />
          {file && (
            <p className="text-xs text-slate-500">Selected: {file.name}</p>
          )}
        </div>

        {/* Job description textarea */}
        <div className="space-y-1.5">
          <label htmlFor="job" className="block text-sm font-medium">
            Job description
          </label>
          <textarea
            id="job"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the full job description here…"
            className="block w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          <p className="text-xs text-slate-500">
            {jobTooShort
              ? `Please enter at least ${MIN_JOB_CHARS} characters.`
              : `${jobDescription.trim().length} characters`}
          </p>
        </div>

        {/* Error state */}
        {status.kind === "error" && (
          <ErrorMessage
            title="Could not save"
            details={status.message}
            onRetry={() => setStatus({ kind: "idle" })}
          />
        )}

        {/* Submit / loading */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Analyze
          </button>
          {status.kind === "submitting" && <Loading label="Analyzing…" />}
        </div>
      </form>
    </Card>
  );
}
