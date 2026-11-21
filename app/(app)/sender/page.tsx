import { SenderCard } from "@/components/sender/SenderCard";
import { getLocalMidnight } from "@/lib/sent-today";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EmailConnection } from "@/lib/types";

const ACTIVE_STATUS = "active";
const SENT_TYPE = "email_sent";

export default async function SenderPage() {
  const supabase = await createSupabaseServerClient();
  const [connectionResult, businessResult] = await Promise.all([
    supabase
      .from("email_connections")
      .select("id, from_email, status, daily_send_limit")
      .eq("status", ACTIVE_STATUS)
      .limit(1)
      .maybeSingle(),
    supabase.from("businesses").select("timezone").limit(1).maybeSingle(),
  ]);
  if (connectionResult.error || businessResult.error) throw new Error("Could not load the sender.");

  const connection = connectionResult.data as EmailConnection | null;
  if (!connection) {
    return (
      <div>
        <h1 className="mb-4 text-xl font-semibold text-slate-900">Sender</h1>
        <p className="text-sm text-slate-700">
          No active sender connection. The agent skips sending until one is connected.
        </p>
      </div>
    );
  }

  const startOfToday = getLocalMidnight(businessResult.data?.timezone ?? "UTC");
  const { count, error: countError } = await supabase
    .from("activity_logs")
    .select("id", { count: "exact", head: true })
    .eq("type", SENT_TYPE)
    .gte("created_at", startOfToday.toISOString());
  if (countError) throw new Error("Could not count today's emails.");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Sender</h1>
      <SenderCard connection={connection} sentToday={count ?? 0} />
    </div>
  );
}