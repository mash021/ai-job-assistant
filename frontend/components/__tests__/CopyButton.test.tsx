import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { CopyButton } from "@/components/CopyButton";

describe("CopyButton", () => {
  it("copies text and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // jsdom has no clipboard by default; provide a mock implementation.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<CopyButton text="hello world" label="Copy" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("hello world");
    // The label switches to "Copied!" after the async write resolves.
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });
});
