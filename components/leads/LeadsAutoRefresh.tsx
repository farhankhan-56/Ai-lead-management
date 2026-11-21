"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 30000;

export function LeadsAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timerId = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, [router]);

  return null;
}