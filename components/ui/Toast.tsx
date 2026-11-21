"use client";

import { useEffect } from "react";

const SUCCESS_VISIBLE_MS = 5000;

type ToastTone = "error" | "success";

export type ToastState = { message: string; tone: ToastTone };

type ToastProps = ToastState & { onDismiss: () => void };

const TONE_STYLES: Record<ToastTone, string> = {
  error: "bg-red-700 text-white",
  success: "bg-green-800 text-white",
};

export function Toast({ message, tone, onDismiss }: ToastProps) {
  useEffect(() => {
    if (tone !== "success") return;
    const timerId = setTimeout(onDismiss, SUCCESS_VISIBLE_MS);
    return () => clearTimeout(timerId);
  }, [tone, message, onDismiss]);

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-md items-start justify-between gap-3 rounded px-4 py-3 text-sm shadow-lg md:bottom-4 ${TONE_STYLES[tone]}`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="font-medium underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        Dismiss
      </button>
    </div>
  );
}