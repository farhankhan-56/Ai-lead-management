"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { getFieldErrors, type FieldErrors } from "@/lib/field-errors";
import { businessSettingsSchema } from "@/lib/schemas/settings";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Business } from "@/lib/types";

function readSettings(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");

  return {
    name: text("name"),
    high_priority_threshold: text("high_priority_threshold"),
    alert_email: text("alert_email"),
    brand_voice: text("brand_voice"),
    services: text("services"),
    timezone: text("timezone"),
    followup_interval_days: text("followup_interval_days"),
    max_followups: text("max_followups"),
    auto_send_followups: formData.get("auto_send_followups") === "on",
  };
}

export function SettingsForm({ business }: { business: Business }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = businessSettingsSchema.safeParse(readSettings(new FormData(event.currentTarget)));
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error));
      return;
    }

    setFieldErrors({});
    setIsSaving(true);
    const { data, error } = await createSupabaseBrowserClient()
      .from("businesses")
      .update(validation.data)
      .eq("id", business.id)
      .select("id");
    setIsSaving(false);

    if (error || !data?.length) {
      setToast({ tone: "error", message: "Could not save the settings. Try again." });
      return;
    }

    setToast({ tone: "success", message: "Settings saved." });
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-xl space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <FormField name="name" label="Business name" defaultValue={business.name} error={fieldErrors.name} isRequired />
      <FormField
        name="high_priority_threshold"
        label="High priority score threshold"
        defaultValue={String(business.high_priority_threshold)}
        inputMode="numeric"
        hint="Leads scoring at or above this value (0-100) are High priority and get an alert and an automatic draft."
        error={fieldErrors.high_priority_threshold}
        isRequired
      />
      <FormField
        name="alert_email"
        label="Alert email"
        type="email"
        defaultValue={business.alert_email ?? ""}
        hint="Where high-priority alerts are sent."
        error={fieldErrors.alert_email}
      />
      <FormField
        name="brand_voice"
        label="Brand voice"
        defaultValue={business.brand_voice ?? ""}
        isMultiline
        error={fieldErrors.brand_voice}
      />
      <FormField
        name="services"
        label="Services"
        defaultValue={business.services ?? ""}
        isMultiline
        error={fieldErrors.services}
      />
      <FormField
        name="timezone"
        label="Time zone"
        defaultValue={business.timezone}
        hint="For example Asia/Karachi. Follow-ups are sent at 9 AM in this time zone."
        error={fieldErrors.timezone}
        isRequired
      />
      <FormField
        name="followup_interval_days"
        label="Days between follow-ups"
        defaultValue={String(business.followup_interval_days)}
        inputMode="numeric"
        error={fieldErrors.followup_interval_days}
        isRequired
      />
      <FormField
        name="max_followups"
        label="Maximum follow-ups"
        defaultValue={String(business.max_followups)}
        inputMode="numeric"
        error={fieldErrors.max_followups}
        isRequired
      />
      <div className="flex items-start gap-2">
        <input
          id="auto_send_followups"
          name="auto_send_followups"
          type="checkbox"
          defaultChecked={business.auto_send_followups}
          className="mt-1 h-4 w-4"
        />
        <label htmlFor="auto_send_followups" className="text-sm">
          <span className="font-medium">Send follow-ups automatically</span>
          <span className="block text-slate-700">When off, each follow-up waits for your approval.</span>
        </label>
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save settings"}
      </Button>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </form>
  );
}