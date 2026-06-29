import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getProgress,
  getReviewRecords,
  getWeaknessRanking,
  getWrongAnswers
} from "@/lib/content";

export default function DashboardPage() {
  const units = getProgress();
  const weaknessRanking = getWeaknessRanking();
  const wrongAnswers = getWrongAnswers();
  const reviews = getReviewRecords();
  const completed = units.filter((unit) => unit.status === "completed").length;
  const inProgress = units.filter((unit) => unit.status === "in_progress").length;
  const next = units.filter((unit) => unit.status === "next").length;
  const averageMastery = Math.round(
    units.reduce((sum, unit) => sum + unit.mastery, 0) / units.length
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
            Local-first study hub
          </p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-ink">
                Units 33-43 Progress
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
                Track grammar status, review weak points, and keep Jason's
                confusing points close to the examples.
              </p>
            </div>
            <Link
              href="/units/unit-43"
              className="inline-flex rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf/90"
            >
              Continue Unit 43
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2">
          <StatCard label="Completed" value={completed} tone="leaf" />
          <StatCard label="In Progress" value={inProgress} tone="gold" />
          <StatCard label="Next" value={next} tone="sky" />
          <StatCard label="Avg. Mastery" value={`${averageMastery}%`} tone="coral" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Unit Roadmap</h3>
            <span className="text-sm text-ink/55">{units.length} units</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {units.map((unit) => (
              <Link
                key={unit.unit}
                href={`/units/unit-${unit.unit}`}
                className="rounded-lg border border-ink/10 p-4 transition hover:border-leaf/30 hover:bg-mist/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Unit {unit.unit}
                    </p>
                    <h4 className="mt-1 text-base font-bold text-ink">
                      {unit.title}
                    </h4>
                  </div>
                  <StatusBadge status={unit.status} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-ink/10">
                  <div
                    className="h-2 rounded-full bg-leaf"
                    style={{ width: `${unit.mastery}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink/55">
                  Mastery {unit.mastery}%
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
            <h3 className="text-lg font-bold text-ink">Weakness Ranking</h3>
            <div className="mt-4 space-y-3">
              {weaknessRanking.map((weakness, index) => (
                <div
                  key={weakness.label}
                  className="flex items-center gap-3 rounded-md bg-mist/60 p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-leaf">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {weakness.label}
                    </p>
                    <p className="text-xs text-ink/55">
                      Units {weakness.units.sort((a, b) => a - b).join(", ")}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-coral">
                    {weakness.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
            <h3 className="text-lg font-bold text-ink">Review Snapshot</h3>
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <div key={review.unit} className="rounded-md border border-ink/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      Unit {review.unit}
                    </p>
                    <span className="text-sm font-bold text-leaf">
                      {Math.round((review.score / review.total) * 100)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">{review.title}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink/60">
              {wrongAnswers.length} wrong-answer seeds are ready for review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone
}: {
  label: string;
  value: number | string;
  tone: "leaf" | "gold" | "sky" | "coral";
}) {
  const colors = {
    leaf: "text-leaf",
    gold: "text-gold",
    sky: "text-sky",
    coral: "text-coral"
  };

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${colors[tone]}`}>{value}</p>
    </div>
  );
}
