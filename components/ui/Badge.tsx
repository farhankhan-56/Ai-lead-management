export type BadgeTone = "high" | "medium" | "low" | "ok" | "accent";

const TONE_STYLES: Record<BadgeTone, string> = {
  high: "bg-high/15 text-high ring-high/30",
  medium: "bg-medium/15 text-medium ring-medium/30",
  low: "bg-low/15 text-low ring-low/30",
  ok: "bg-ok/15 text-ok ring-ok/30",
  accent: "bg-accent/15 text-accent ring-accent/30",
};

type BadgeProps = {
  tone: BadgeTone;
  label: string;
  isPulsing?: boolean;
};

export function Badge({ tone, label, isPulsing = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_STYLES[tone]}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full bg-current ${isPulsing ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}