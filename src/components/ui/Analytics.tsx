"use client";

import { loadAnalytics } from "@/src/lib/firebase";
import { useEffect } from "react";

export default function Analytics() {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return null;
}