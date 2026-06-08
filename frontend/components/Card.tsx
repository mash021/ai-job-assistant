import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card animate-slide-up ${className}`}>
      {title && (
        <header className="mb-6">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
