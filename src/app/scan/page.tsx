"use client";

import React, { Suspense } from "react";
import Scan from "@/client-pages/Scan";

export default function ScanPage() {
  return (
    <Suspense fallback={null}>
      <Scan />
    </Suspense>
  );
}
