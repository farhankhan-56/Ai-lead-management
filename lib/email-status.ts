export const EMAIL_STATUSES = [
  "NONE",
  "PENDING_APPROVAL",
  "APPROVED",
  "SENDING",
  "SENT",
  "REJECTED",
  "FAILED",
  "SKIPPED",
] as const;

export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export type StatusMode = "review" | "generate" | "queued" | "sent" | "skipped";

const STATUS_MODES: Record<EmailStatus, StatusMode> = {
  NONE: "generate",
  PENDING_APPROVAL: "review",
  APPROVED: "queued",
  SENDING: "queued",
  SENT: "sent",
  REJECTED: "generate",
  FAILED: "generate",
  SKIPPED: "skipped",
};

export function getStatusMode(status: EmailStatus): StatusMode {
  return STATUS_MODES[status];
}