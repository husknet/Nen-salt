"use client";

import { Suspense } from "react";
import EmailProcessor from "./EmailProcessor";

export default function Page() {
  return (
    <Suspense fallback={<div className=\"text-white\">Loading...</div>}>
      <EmailProcessor />
    </Suspense>
  );
}
