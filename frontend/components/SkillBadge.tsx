import { getSkillIcon } from "@/lib/skillIcons";

type SkillBadgeVariant = "matched" | "missing";

export function SkillBadge({
  skill,
  variant = "matched",
}: {
  skill: string;
  variant?: SkillBadgeVariant;
}) {
  const Icon = getSkillIcon(skill);

  return (
    <li
      className={
        variant === "missing" ? "skill-badge skill-badge-missing" : "skill-badge"
      }
    >
      <Icon className="skill-badge-icon" aria-hidden />
      <span>{skill}</span>
    </li>
  );
}
