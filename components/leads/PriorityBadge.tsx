import { Badge, type BadgeTone } from "@/components/ui/Badge";

const PRIORITY_TONES = new Map<string, BadgeTone>([
  ["high", "high"],
  ["medium", "medium"],
  ["low", "low"],
]);

export function PriorityBadge({ priority }: { priority: string | null }) {
  const label = priority ?? "No priority";

  return <Badge tone={PRIORITY_TONES.get(label.toLowerCase()) ?? "low"} label={label} />;
}