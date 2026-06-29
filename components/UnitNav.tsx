import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import type { UnitProgress } from "@/lib/types";

export function UnitNav({
  units,
  activeUnit
}: {
  units: UnitProgress[];
  activeUnit?: number;
}) {
  return (
    <aside className="rounded-lg border border-ink/10 bg-white p-3 shadow-soft">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
        Unit Path
      </p>
      <div className="space-y-1">
        {units.map((unit) => (
          <Link
            key={unit.unit}
            href={`/units/unit-${unit.unit}`}
            className={`block rounded-md px-3 py-2 transition ${
              activeUnit === unit.unit
                ? "bg-mist text-ink"
                : "text-ink/70 hover:bg-mist/70 hover:text-ink"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">Unit {unit.unit}</span>
              <StatusBadge status={unit.status} />
            </div>
            <p className="mt-1 truncate text-xs">{unit.title}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
