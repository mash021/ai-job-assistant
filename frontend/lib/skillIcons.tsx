import type { IconType } from "react-icons";
import {
  SiAmazonwebservices,
  SiCplusplus,
  SiCss3,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGo,
  SiGooglecloud,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
} from "react-icons/si";
import { TbApi, TbBrandAzure, TbCode, TbDatabase, TbRefresh } from "react-icons/tb";

/** Generic skill icon when no brand icon is mapped. */
export const IconSkillDefault: IconType = TbCode;

const SKILL_ICON_MAP: Record<string, IconType> = {
  Python: SiPython,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  FastAPI: SiFastapi,
  Django: SiDjango,
  Flask: SiFlask,
  SQL: TbDatabase,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  AWS: SiAmazonwebservices,
  GCP: SiGooglecloud,
  Azure: TbBrandAzure,
  Git: SiGit,
  "CI/CD": TbRefresh,
  REST: TbApi,
  GraphQL: SiGraphql,
  HTML: SiHtml5,
  CSS: SiCss3,
  "Tailwind CSS": SiTailwindcss,
  Java: SiOpenjdk,
  Go: SiGo,
  "C++": SiCplusplus,
  "Machine Learning": SiTensorflow,
  Pandas: SiPandas,
  Linux: SiLinux,
};

export function getSkillIcon(skill: string): IconType {
  return SKILL_ICON_MAP[skill] ?? IconSkillDefault;
}
