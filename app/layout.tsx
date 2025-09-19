import "./styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Processor",
  description: "Scans and processes email domain securely",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


