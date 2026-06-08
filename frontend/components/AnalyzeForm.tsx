"use client";

import { useState } from "react";

import { AnalysisResult } from "@/components/AnalysisResult";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { IconUpload } from "@/components/Icons";
import { Loading } from "@/components/Loading";
import { api, ApiError } from "@/lib/api";
import type { Comparison } from "@/lib/types";

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

  if (status.kind === "success") {
    return (
      <Card title="Results" subtitle="Your analysis is ready">
        <AnalysisResult result={status.result} onReset={resetForm} />
      </Card>
    );
  }

  return (
    <Card title="New analysis" subtitle="Resume and job description required">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="resume" className="label-caps">
            Resume
          </label>
          <label
            htmlFor="resume"
            className={`flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-5 transition duration-200 ${
              file
                ? "border-[var(--vivid-teal)] bg-[var(--surface)]"
                : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--vivid-teal)]"
            }`}
          >
            <span className="icon-box shrink-0">
              <IconUpload />
            </span>
            <span>
              <span className="block text-sm font-medium text-[var(--text)]">
                {file ? file.name : "Choose a file"}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                PDF or TXT · 5 MB max
              </span>
            </span>
            <input
              id="resume"
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>
        </div>

        <div className="space-y-3">
          <label htmlFor="job" className="label-caps">
            Job description
          </label>
          <textarea
            id="job"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={7}
            placeholder="Paste the full job description…"
            className="input-field resize-none"
          />
          <p className="text-xs text-[var(--text-muted)]">
            {jobTooShort
              ? `Minimum ${MIN_JOB_CHARS} characters`
              : `${jobDescription.trim().length} characters`}
          </p>
        </div>

        {status.kind === "error" && (
          <ErrorMessage
            title="Analysis failed"
            details={status.message}
            onRetry={() => setStatus({ kind: "idle" })}
          />
        )}

        <div className="flex items-center gap-6 pt-1">
          <button type="submit" disabled={!canSubmit} className="btn-primary">
            Analyze
          </button>
          {status.kind === "submitting" && <Loading />}
        </div>
      </form>
    </Card>
  );
}
