import type { UnitStatus } from "@/lib/types";

const statusStyles: Record<UnitStatus, string> = {
  completed: "bg-leaf/10 text-leaf ring-leaf/20",
  in_progress: "bg-gold/10 text-gold ring-gold/20",
  next: "bg-sky/10 text-sky ring-sky/20",
  not_started: "bg-ink/5 text-ink/55 ring-ink/10"
};

const statusLabels: Record<UnitStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  next: "Next",
  not_started: "Not Started"
};

export function StatusBadge({ status }: { status: UnitStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
