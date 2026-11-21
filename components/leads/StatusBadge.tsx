import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { EmailStatus } from "@/lib/email-status";

const STATUS_BADGES: Record<EmailStatus, { label: string; tone: BadgeTone }> = {
  NONE: { label: "None", tone: "low" },
  PENDING_APPROVAL: { label: "Pending approval", tone: "medium" },
  APPROVED: { label: "Approved", tone: "accent" },
  SENDING: { label: "Sending", tone: "accent" },
  SENT: { label: "Sent", tone: "ok" },
  REJECTED: { label: "Rejected", tone: "high" },
  FAILED: { label: "Failed", tone: "high" },
  SKIPPED: { label: "Skipped", tone: "low" },
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  const { label, tone } = STATUS_BADGES[status];

  return <Badge tone={tone} label={label} isPulsing={status === "SENDING"} />;
}