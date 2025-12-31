import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Task Pilot",
  description: "An intelligent task management companion powered by autonomous prioritization"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
      </body>
    </html>
  );
}
