"use client";
export const dynamic = "error";
export const fetchCache = "force-no-store";
import EmailProcessor from "./EmailProcessor";

export default function Page() {
  return <EmailProcessor />;
}
