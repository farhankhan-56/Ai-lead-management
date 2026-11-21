"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { dailyLimitSchema } from "@/lib/schemas/settings";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { EmailConnection } from "@/lib/types";

type SenderCardProps = {
  connection: EmailConnection;
  sentToday: number;
};

export function SenderCard({ connection, sentToday }: SenderCardProps) {
  const router = useRouter();
  const [limit, setLimit] = useState(connection.daily_send_limit);
  const [limitError, setLimitError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entered = String(new FormData(event.currentTarget).get("daily_send_limit") ?? "");
    const validation = dailyLimitSchema.safeParse(entered);
    if (!validation.success) {
      setLimitError(validation.error.issues[0].message);
      return;
    }

    setLimitError(undefined);
    setIsSaving(true);
    const { data, error } = await createSupabaseBrowserClient()
      .from("email_connections")
      .update({ daily_send_limit: validation.data })
      .eq("id", connection.id)
      .select("id");
    setIsSaving(false);

    if (error || !data?.length) {
      setToast({ tone: "error", message: "Could not save the daily limit. Try again." });
      return;
    }

    setLimit(validation.data);
    setToast({ tone: "success", message: "Daily limit saved." });
    router.refresh();
  }

  return (
    <section aria-labelledby="sender-heading" className="max-w-xl space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 id="sender-heading" className="text-lg font-semibold">
        Sender
      </h2>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium text-slate-800">From email:</dt>
          <dd className="text-slate-700">{connection.from_email}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-slate-800">Status:</dt>
          <dd className="text-slate-700">{connection.status}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-slate-800">Sent today:</dt>
          <dd className="text-slate-700">
            {sentToday} / {limit}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-slate-700">
        Emails go out through the Gmail account connected in n8n. Replies are directed to the address above.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <FormField
          name="daily_send_limit"
          label="Daily send limit"
          defaultValue={String(connection.daily_send_limit)}
          inputMode="numeric"
          hint="The most emails the agent sends per day."
          error={limitError}
          isRequired
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save limit"}
        </Button>
      </form>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </section>
  );
}