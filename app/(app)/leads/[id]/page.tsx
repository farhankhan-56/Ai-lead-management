import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactHeader } from "@/components/lead-detail/ContactHeader";
import { DraftPanel } from "@/components/lead-detail/DraftPanel";
import { FollowUpInfo } from "@/components/lead-detail/FollowUpInfo";
import { GmailNote } from "@/components/lead-detail/GmailNote";
import { ScoreSummary } from "@/components/lead-detail/ScoreSummary";
import { Timeline } from "@/components/lead-detail/Timeline";
import { leadIdSchema } from "@/lib/schemas/action";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActivityLog, LeadDetail } from "@/lib/types";

type LeadPageProps = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: LeadPageProps) {
    const leadId = leadIdSchema.safeParse((await params).id);
    if (!leadId.success) notFound();

    const supabase = await createSupabaseServerClient();
    const [leadResult, logsResult] = await Promise.all([
        supabase.from("leads").select("*, contact:contacts(*)").eq("id", leadId.data).maybeSingle(),
        supabase
            .from("activity_logs")
            .select("lead_id, type, detail, actor, created_at")
            .eq("lead_id", leadId.data)
            .order("created_at", { ascending: false }),
    ]);
    if (leadResult.error || logsResult.error) throw new Error("Could not load the lead.");
    if (!leadResult.data) notFound();

    const lead = leadResult.data as LeadDetail;
    const logs = (logsResult.data ?? []) as ActivityLog[];
    const skipReason = logs.find((log) => log.type === "send_skipped")?.detail ?? null;

    return (
        <div>
            <Link
                href="/leads"
                className="mb-3 inline-block text-sm font-medium text-slate-800 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
            >
                ← Back to leads
            </Link>
            <ContactHeader contact={lead.contact} />
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                    <ScoreSummary lead={lead} />
                    <FollowUpInfo lead={lead} />
                </div>
                <div className="space-y-4">
                    <DraftPanel lead={lead} skipReason={skipReason} />
                    <GmailNote />
                </div>
            </div>
            <div className="mt-4">
                <Timeline logs={logs} />
            </div>
        </div>
    );
}