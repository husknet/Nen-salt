import "./styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Processor",
  description: "Checks MX and encrypts email securely",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
