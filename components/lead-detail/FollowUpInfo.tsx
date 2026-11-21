import { formatDate, formatDateTime } from "@/lib/format";
import type { LeadDetail } from "@/lib/types";

function getNextFollowupText(lead: LeadDetail): string {
  if (lead.followup_paused) return "Paused (sequence ended)";
  return lead.next_followup_date ? formatDate(lead.next_followup_date) : "—";
}

export function FollowUpInfo({ lead }: { lead: LeadDetail }) {
  const facts: [string, string][] = [
    ["Sent", lead.sent_at ? formatDateTime(lead.sent_at) : "Not sent yet"],
    ["Follow-ups sent", String(lead.followup_count)],
    ["Next follow-up", getNextFollowupText(lead)],
  ];

  return (
    <section aria-labelledby="followup-heading" className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 id="followup-heading" className="text-lg font-semibold">
        Follow-ups
      </h2>
      <dl className="space-y-2 text-sm">
        {facts.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <dt className="font-medium text-slate-800">{label}:</dt>
            <dd className="text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}