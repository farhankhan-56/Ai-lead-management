import { SettingsForm } from "@/components/settings/SettingsForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Business } from "@/lib/types";

const COLUMNS =
  "id, name, high_priority_threshold, alert_email, brand_voice, services, timezone, followup_interval_days, max_followups, auto_send_followups";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("businesses").select(COLUMNS).limit(1).maybeSingle();
  if (error) throw new Error("Could not load the settings.");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Settings</h1>
      {data ? (
        <SettingsForm business={data as Business} />
      ) : (
        <p className="text-sm text-slate-700">No business was found for your account.</p>
      )}
    </div>
  );
}