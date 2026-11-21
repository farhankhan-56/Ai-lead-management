import { Button } from "@/components/ui/Button";
import type { StatusMode } from "@/lib/email-status";

type ActionButtonsProps = {
  mode: StatusMode;
  isBusy: boolean;
  onGenerate: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function ActionButtons({ mode, isBusy, onGenerate, onApprove, onReject }: ActionButtonsProps) {
  if (mode === "generate") {
    return (
      <Button onClick={onGenerate} disabled={isBusy}>
        Generate draft
      </Button>
    );
  }
  if (mode !== "review") return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onApprove} disabled={isBusy}>
        Approve
      </Button>
      <Button variant="secondary" onClick={onReject} disabled={isBusy}>
        Reject
      </Button>
    </div>
  );
}