import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Job Assistant",
  description: "Compare your resume with job descriptions and get AI insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="page-shell font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
