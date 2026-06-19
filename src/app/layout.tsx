import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "G-Link | Student Club Operations",
  description: "A connected operations workspace for student club executive boards.",
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
