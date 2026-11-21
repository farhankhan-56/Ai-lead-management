import { PriorityBadge } from "@/components/leads/PriorityBadge";
import type { LeadDetail } from "@/lib/types";

function TextBlock({ label, text }: { label: string; text: string | null }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-800">{label}</h3>
      <p className="whitespace-pre-wrap text-sm text-slate-700">{text ?? "—"}</p>
    </div>
  );
}

export function ScoreSummary({ lead }: { lead: LeadDetail }) {
  const facts: [string, string | null][] = [
    ["Source", lead.source],
    ["Lead status", lead.lead_status],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
  ];

  return (
    <section aria-labelledby="score-heading" className="space-y-4 rounded-lg bg-white p-4 shadow">
      <h2 id="score-heading" className="text-lg font-semibold">
        Score
      </h2>
      <div className="flex items-center gap-3">
        <p className="text-3xl font-semibold">
          {lead.score ?? "—"}
          <span className="text-base font-normal text-slate-700">/100</span>
        </p>
        <PriorityBadge priority={lead.priority} />
      </div>
      <TextBlock label="AI summary" text={lead.ai_summary} />
      <TextBlock label="Next action" text={lead.next_action} />
      <TextBlock label="Project notes" text={lead.project_notes} />
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="font-medium text-slate-800">{label}</dt>
            <dd className="text-slate-700">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}