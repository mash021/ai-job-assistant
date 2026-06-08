import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ErrorMessage } from "@/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the title and details", () => {
    render(<ErrorMessage title="Boom" details="Something failed" />);
    expect(screen.getByText("Boom")).toBeInTheDocument();
    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("does not render a retry button when onRetry is omitted", () => {
    render(<ErrorMessage title="Boom" />);
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("calls onRetry when the retry button is clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage title="Boom" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
