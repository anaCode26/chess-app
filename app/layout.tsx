import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess App",
  description: "Chess club website and tournament management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
