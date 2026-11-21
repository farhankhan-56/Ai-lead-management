"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type OptOutSwitchProps = {
  contactId: string;
  initialValue: boolean;
};

export function OptOutSwitch({ contactId, initialValue }: OptOutSwitchProps) {
  const router = useRouter();
  const [isOptedOut, setIsOptedOut] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function handleToggle() {
    const nextValue = !isOptedOut;
    setIsSaving(true);
    const { data, error } = await createSupabaseBrowserClient()
      .from("contacts")
      .update({ opted_out: nextValue })
      .eq("id", contactId)
      .select("id");
    setIsSaving(false);

    if (error || !data?.length) {
      setToast({ tone: "error", message: "Could not save the opt-out change. Try again." });
      return;
    }

    setIsOptedOut(nextValue);
    setToast({
      tone: "success",
      message: nextValue ? "Contact opted out. No more emails will be sent." : "Contact opted back in.",
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isOptedOut}
        aria-labelledby="opt-out-label"
        onClick={handleToggle}
        disabled={isSaving}
        className={`relative h-6 w-11 shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60 ${
          isOptedOut ? "bg-red-700" : "bg-slate-500"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            isOptedOut ? "translate-x-5" : ""
          }`}
        />
      </button>
      <span id="opt-out-label" className="text-sm font-medium text-slate-800">
        Opted out of emails
      </span>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}