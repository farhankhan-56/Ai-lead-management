"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/components/lead-detail/ActionButtons";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FIELD_CLASS } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { getStatusMode, type EmailStatus } from "@/lib/email-status";
import type { LeadActionReply } from "@/lib/n8n/proxy";
import type { ActionInput } from "@/lib/schemas/action";
import type { LeadDetail } from "@/lib/types";

const REQUEST_TIMEOUT_MS = 120000;
const FALLBACK_ERROR = "Something went wrong. Try again.";
const QUEUED_NOTE = "Queued. This email sends within 5 minutes.";

const ERROR_MESSAGES = new Map([
  ["not_pending_approval", "This draft is no longer waiting for approval. The page was refreshed."],
  ["lead_not_found", "This lead could not be found."],
  ["invalid_action", "That action is not allowed."],
  ["invalid_body", "Check the subject and body, then try again."],
  ["unauthorized", "Your session has expired. Sign in again."],
  ["n8n_unavailable", "The lead agent is not responding. Try again."],
]);

const STATUS_NOTES: Record<EmailStatus, string | null> = {
  NONE: "No draft yet. Generate one with the AI.",
  PENDING_APPROVAL: null,
  APPROVED: QUEUED_NOTE,
  SENDING: QUEUED_NOTE,
  SENT: "This email was sent.",
  REJECTED: "The last draft was rejected. Generate a new one.",
  FAILED: "Sending failed. Generate a new draft to try again.",
  SKIPPED: null,
};

function describeError(reply: LeadActionReply): string {
  if (reply.error === "draft_skipped") {
    return reply.reason === "contact_opted_out"
      ? "This contact has opted out, so no draft can be created."
      : "A draft can't be created for the current email status.";
  }
  return ERROR_MESSAGES.get(reply.error ?? "") ?? FALLBACK_ERROR;
}

function getChangedValue(nextValue: string, savedValue: string | null): string | undefined {
  return nextValue === (savedValue ?? "").trim() ? undefined : nextValue;
}

async function postAction(leadId: string, payload: ActionInput): Promise<LeadActionReply> {
  try {
    const response = await fetch(`/api/leads/${encodeURIComponent(leadId)}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const reply = (await response.json()) as LeadActionReply | null;
    return typeof reply?.ok === "boolean" ? reply : { ok: false };
  } catch {
    return { ok: false };
  }
}

type DraftPanelProps = {
  lead: LeadDetail;
  skipReason: string | null;
};

export function DraftPanel({ lead, skipReason }: DraftPanelProps) {
  const router = useRouter();
  const mode = getStatusMode(lead.email_status);
  const draftKey = `${lead.email_status}:${lead.draft_subject}:${lead.draft_body}`;
  const [syncedKey, setSyncedKey] = useState(draftKey);
  const [subject, setSubject] = useState(lead.draft_subject ?? "");
  const [body, setBody] = useState(lead.draft_body ?? "");
  const [isBusy, setIsBusy] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // A new saved draft or status replaces whatever is in the edit boxes.
  if (syncedKey !== draftKey) {
    setSyncedKey(draftKey);
    setSubject(lead.draft_subject ?? "");
    setBody(lead.draft_body ?? "");
  }

  const note = mode === "skipped" ? `Skipped: ${skipReason ?? "no reason recorded."}` : STATUS_NOTES[lead.email_status];

  async function runAction(payload: ActionInput, successMessage: string) {
    setIsBusy(true);
    const reply = await postAction(lead.id, payload);
    setIsBusy(false);
    setToast(reply.ok ? { tone: "success", message: successMessage } : { tone: "error", message: describeError(reply) });
    router.refresh();
  }

  async function handleApprove() {
    const nextSubject = subject.trim();
    const nextBody = body.trim();
    if (!nextSubject || !nextBody) {
      setToast({ tone: "error", message: "Subject and body can't be empty." });
      return;
    }

    await runAction(
      {
        action: "approve",
        subject: getChangedValue(nextSubject, lead.draft_subject),
        body: getChangedValue(nextBody, lead.draft_body),
      },
      "Draft approved. It sends within 5 minutes.",
    );
  }

  async function handleConfirmReject() {
    setIsConfirmOpen(false);
    await runAction({ action: "reject" }, "Draft rejected.");
  }

  return (
    <section aria-labelledby="draft-heading" className="space-y-4 rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between gap-2">
        <h2 id="draft-heading" className="text-lg font-semibold">
          Email draft
        </h2>
        <StatusBadge status={lead.email_status} />
      </div>

      {mode === "review" && lead.followup_count > 0 && (
        <p className="text-sm font-medium text-slate-800">Follow-up #{lead.followup_count}</p>
      )}
      {note && <p className="text-sm text-slate-800">{note}</p>}

      {mode === "review" ? (
        <>
          <div className="space-y-1">
            <label htmlFor="draft-subject" className="block text-sm font-medium">
              Subject
            </label>
            <input
              id="draft-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={isBusy}
              maxLength={200}
              className={FIELD_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="draft-body" className="block text-sm font-medium">
              Body
            </label>
            <textarea
              id="draft-body"
              rows={10}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              disabled={isBusy}
              maxLength={10000}
              className={FIELD_CLASS}
            />
          </div>
        </>
      ) : (
        Boolean(lead.draft_body) && (
          <div className="space-y-2 rounded border border-slate-300 p-3 text-sm">
            <p className="font-medium">{lead.draft_subject}</p>
            <p className="whitespace-pre-wrap text-slate-800">{lead.draft_body}</p>
          </div>
        )
      )}

      <ActionButtons
        mode={mode}
        isBusy={isBusy}
        onGenerate={() => runAction({ action: "draft" }, "Draft created. Review it, then approve or reject.")}
        onApprove={handleApprove}
        onReject={() => setIsConfirmOpen(true)}
      />
      {isBusy && <Spinner label="Working... AI drafts can take up to 2 minutes." />}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Reject this draft?"
        message="The draft will be marked as rejected. You can generate a new one afterwards."
        confirmLabel="Reject draft"
        onConfirm={handleConfirmReject}
        onCancel={() => setIsConfirmOpen(false)}
      />
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </section>
  );
}