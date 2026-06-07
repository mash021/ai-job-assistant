import type { Metadata } from "next";
import "./globals.css";

// Page-level metadata used in the document <head>.
export const metadata: Metadata = {
  title: "AI Job Assistant",
  description: "Compare your resume with job descriptions and get AI insights.",
};

// The root layout wraps every page in the app.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
