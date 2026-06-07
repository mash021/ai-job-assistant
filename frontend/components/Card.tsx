/**
 * Simple presentational card container.
 *
 * Wraps content in a consistent bordered, padded, white surface. Keeps page
 * markup tidy and the visual style consistent across sections.
 */

import type { ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
