"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconLogo } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Analyze" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--text)] transition hover:opacity-80"
        >
          <span className="icon-box !h-9 !w-9">
            <IconLogo className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Job Assistant</span>
        </Link>

        <div className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm transition duration-200 ${
                  active
                    ? "nav-active"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
