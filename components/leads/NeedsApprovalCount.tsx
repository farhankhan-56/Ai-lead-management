import Link from "next/link";
import type { EmailStatus } from "@/lib/email-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PENDING_STATUS: EmailStatus = "PENDING_APPROVAL";

export async function NeedsApprovalCount() {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("email_status", PENDING_STATUS);
  if (error) throw new Error("Could not load the approval count.");

  return (
    <p className="mb-4 text-sm text-slate-800">
      <Link
        href={`/leads?email_status=${PENDING_STATUS}`}
        className="font-medium underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
      >
        Needs approval: {count ?? 0}
      </Link>
    </p>
  );
}