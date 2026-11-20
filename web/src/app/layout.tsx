import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nirvaah — Adaptive Business Operations",
  description: "An adaptive business operations workspace that transforms to what your business needs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-porcelain text-ink font-sans selection:bg-lavender-light">
        {children}
      </body>
    </html>
  );
}
