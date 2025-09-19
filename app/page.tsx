"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import EmailProcessor from "./EmailProcessor";

export default function Page() {
  return <EmailProcessor />;
}
