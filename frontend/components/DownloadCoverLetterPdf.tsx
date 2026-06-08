"use client";

import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

import { CoverLetterPdfDocument } from "@/lib/coverLetterPdfDocument";
import {
  applicationPdfFileName,
  extractCompanyName,
  extractJobTitle,
} from "@/lib/extractJobContext";

export function DownloadCoverLetterPdf({
  coverLetter,
  jobDescription,
}: {
  coverLetter: string;
  jobDescription: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    setError(false);

    try {
      const companyName = extractCompanyName(jobDescription);
      const jobTitle = extractJobTitle(jobDescription);

      const blob = await pdf(
        <CoverLetterPdfDocument
          coverLetter={coverLetter}
          companyName={companyName}
          jobTitle={jobTitle}
          generatedAt={new Date()}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = applicationPdfFileName(companyName);
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(true);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="btn-secondary"
    >
      {error ? "Save failed" : downloading ? "Saving…" : "Save PDF"}
    </button>
  );
}
