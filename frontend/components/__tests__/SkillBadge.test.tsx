import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkillBadge } from "@/components/SkillBadge";
import { getSkillIcon } from "@/lib/skillIcons";
import { SiPython } from "react-icons/si";
import { TbCode } from "react-icons/tb";

describe("SkillBadge", () => {
  it("renders skill name with icon", () => {
    render(<SkillBadge skill="Python" />);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("uses brand icon for known skills", () => {
    expect(getSkillIcon("Python")).toBe(SiPython);
    expect(getSkillIcon("JavaScript")).not.toBe(TbCode);
  });

  it("uses default icon for unknown skills", () => {
    expect(getSkillIcon("Some Unknown Skill")).toBe(TbCode);
  });
});
