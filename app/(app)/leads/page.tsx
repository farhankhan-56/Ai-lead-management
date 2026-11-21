import { LeadCard } from "@/components/leads/LeadCard";
import { LeadFilters, PRIORITIES } from "@/components/leads/LeadFilters";
import { NeedsApprovalCount } from "@/components/leads/NeedsApprovalCount";
import { LeadsAutoRefresh } from "@/components/leads/LeadsAutoRefresh";
import { EMAIL_STATUSES } from "@/lib/email-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadWithContact } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pickAllowed(value: string | string[] | undefined, allowed: readonly string[]) {
    if (typeof value !== "string") return undefined;
    return allowed.includes(value) ? value : undefined;
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const priority = pickAllowed(params.priority, PRIORITIES);
    const emailStatus = pickAllowed(params.email_status, EMAIL_STATUSES);

    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from("leads")
        .select("*, contact:contacts(full_name, company)")
        .order("created_at", { ascending: false });
    if (priority) query = query.ilike("priority", priority);
    if (emailStatus) query = query.eq("email_status", emailStatus);

    const { data, error } = await query;
    if (error) throw new Error("Could not load leads.");

    const leads = (data ?? []) as LeadWithContact[];
    const hasFilter = Boolean(priority || emailStatus);

    return (
        <div>
            <LeadsAutoRefresh/>
            <h1 className="mb-4 text-3xl font-semibold text-fg">Leads</h1>
            <NeedsApprovalCount />
            <LeadFilters priority={priority} emailStatus={emailStatus} />
            {leads.length === 0 ? (
                <p className="text-sm text-slate-700">
                    {hasFilter ? "No leads match the filters." : "No leads yet."}
                </p>
            ) : (
                <ul className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </ul>
            )}
        </div>
    );
}