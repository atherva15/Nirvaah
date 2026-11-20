import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nirvaah — Adaptive Business Operations",
  description: "Your business. A clearer way forward.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface-0 text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
