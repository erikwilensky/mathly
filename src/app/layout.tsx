import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mathly — Russell vs. Algebra",
  description: "Interactive algebra lessons and practice, built for one very specific 16-year-old.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-brand-ink font-sans antialiased">{children}</body>
    </html>
  );
}
