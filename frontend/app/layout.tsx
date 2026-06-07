import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Page-level metadata used in the document <head>.
export const metadata: Metadata = {
  title: "AI Job Assistant",
  description: "Compare your resume with job descriptions and get AI insights.",
};

// The root layout wraps every page in the app and provides the top navigation.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
            <Link href="/" className="font-semibold">
              AI Job Assistant
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-slate-600 hover:text-slate-900">
                Analyze
              </Link>
              <Link
                href="/history"
                className="text-slate-600 hover:text-slate-900"
              >
                History
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
