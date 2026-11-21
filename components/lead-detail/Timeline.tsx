import { formatDateTime } from "@/lib/format";
import type { ActivityLog, ActivityType } from "@/lib/types";

const TYPE_LABELS: Record<ActivityType, string> = {
  duplicate_note: "Duplicate note",
  scored: "Scored",
  draft_created: "Draft created",
  approved: "Approved",
  rejected: "Rejected",
  email_sent: "Email sent",
  send_failed: "Send failed",
  send_skipped: "Send skipped",
};

export function Timeline({ logs }: { logs: ActivityLog[] }) {
  return (
    <section aria-labelledby="timeline-heading" className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 id="timeline-heading" className="text-lg font-semibold">
        Activity
      </h2>
      {logs.length === 0 ? (
        <p className="text-sm text-slate-700">No activity yet.</p>
      ) : (
        <ol className="space-y-3">
          {logs.map((log, index) => (
            <li key={`${log.created_at}-${index}`} className="border-l-2 border-slate-300 pl-3 text-sm">
              <p className="font-medium text-slate-900">
                {TYPE_LABELS[log.type] ?? log.type}
                <span className="font-normal text-slate-700"> · {log.actor}</span>
              </p>
              {log.detail && <p className="whitespace-pre-wrap text-slate-700">{log.detail}</p>}
              <time dateTime={log.created_at} className="text-xs text-slate-700">
                {formatDateTime(log.created_at)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}