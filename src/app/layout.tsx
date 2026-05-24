import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G-Link",
  description: "A club operating system for meetings, tasks, events, budgets, and handoff history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
