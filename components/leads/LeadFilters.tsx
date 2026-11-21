import Link from "next/link";
import { EMAIL_STATUSES } from "@/lib/email-status";

export const PRIORITIES = ["high", "medium", "low"] as const;

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900";
const FIELD = `block w-full rounded border border-slate-400 bg-white px-2 py-1.5 text-sm text-slate-900 ${FOCUS}`;
const LABEL = "mb-1 block text-sm font-medium text-slate-800";

function toLabel(value: string) {
  const text = value.replace("_", " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type LeadFiltersProps = {
  priority?: string;
  emailStatus?: string;
};

export function LeadFilters({ priority, emailStatus }: LeadFiltersProps) {
  return (
    <form method="get" action="/leads" className="mb-4 flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="priority" className={LABEL}>
          Priority
        </label>
        <select id="priority" name="priority" defaultValue={priority ?? ""} className={FIELD}>
          <option value="">All</option>
          {PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {toLabel(value)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="email_status" className={LABEL}>
          Email status
        </label>
        <select id="email_status" name="email_status" defaultValue={emailStatus ?? ""} className={FIELD}>
          <option value="">All</option>
          {EMAIL_STATUSES.map((value) => (
            <option key={value} value={value}>
              {toLabel(value)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className={`rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white ${FOCUS}`}
      >
        Apply
      </button>
      <Link href="/leads" className={`px-2 py-1.5 text-sm font-medium text-slate-800 underline ${FOCUS}`}>
        Clear
      </Link>
    </form>
  );
}