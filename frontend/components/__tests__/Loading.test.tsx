import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { Loading } from "@/components/Loading";

describe("Loading", () => {
  it("renders the default label", () => {
    render(<Loading />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<Loading label="Analyzing…" />);
    expect(screen.getByText("Analyzing…")).toBeInTheDocument();
  });
});
