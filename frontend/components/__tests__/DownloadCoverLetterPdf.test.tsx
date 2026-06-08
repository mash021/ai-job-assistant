import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/coverLetterPdfDocument", () => ({
  CoverLetterPdfDocument: () => null,
}));

vi.mock("@react-pdf/renderer", () => ({
  pdf: vi.fn(() => ({
    toBlob: vi.fn().mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" })),
  })),
}));

import { DownloadCoverLetterPdf } from "@/components/DownloadCoverLetterPdf";

describe("DownloadCoverLetterPdf", () => {
  it("renders download button", () => {
    render(
      <DownloadCoverLetterPdf
        coverLetter="Dear Hiring Manager,\n\nI am excited to apply."
        jobDescription="Acme Labs is hiring a Python engineer."
      />,
    );
    expect(screen.getByRole("button", { name: "Save PDF" })).toBeInTheDocument();
  });

  it("triggers pdf generation on click", async () => {
    const createObjectURL = vi.fn(() => "blob:mock");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    render(
      <DownloadCoverLetterPdf
        coverLetter="Dear Hiring Manager,\n\nI am excited to apply."
        jobDescription="Acme Labs is hiring a Python engineer."
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save PDF" }));

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
    });
  });
});
