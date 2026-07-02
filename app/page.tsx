import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getActiveStudyUnits,
  getPracticeCoverage,
  getProgress,
  getReviewRecords,
  getWeaknessRanking,
  getWrongAnswers
} from "@/lib/content";

export default function DashboardPage() {
  const allUnits = getProgress();
  const units = getActiveStudyUnits();
  const weaknessRanking = getWeaknessRanking();
  const wrongAnswers = getWrongAnswers();
  const reviews = getReviewRecords();
  const coverage = getPracticeCoverage();
  const coverageByUnit = new Map(
    coverage.map((item) => [item.unit, item.questionCount])
  );
  const unitsWithQuestions = coverage.filter(
    (item) => item.questionCount > 0
  ).length;
  const currentUnit =
    units.find((unit) => unit.status === "in_progress") ??
    units.find((unit) => unit.status === "next") ??
    units[0];
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
                Today&apos;s Study Command Center
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
                Continue the active unit, practice the same grammar immediately,
                then review the weakest patterns. The full Unit 1-145 map now has
                practice coverage.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/units/unit-${currentUnit.unit}`}
                className="inline-flex rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf/90"
              >
                Read Unit {currentUnit.unit}
              </Link>
              <Link
                href={`/practice?unit=${currentUnit.unit}`}
                className="inline-flex rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-mist"
              >
                Practice Unit {currentUnit.unit}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2">
          <StatCard label="Completed" value={completed} tone="leaf" />
          <StatCard label="In Progress" value={inProgress} tone="gold" />
          <StatCard label="Next" value={next} tone="sky" />
          <StatCard
            label="Practice Coverage"
            value={`${unitsWithQuestions}/${allUnits.length}`}
            tone="coral"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="1. Learn"
          body={`Read the current explanations and confusing patterns for Unit ${currentUnit.unit}.`}
          href={`/units/unit-${currentUnit.unit}`}
          label="Open unit"
          tone="leaf"
        />
        <ActionCard
          title="2. Practice"
          body={`Answer ${coverageByUnit.get(currentUnit.unit) ?? 0} questions for Unit ${currentUnit.unit}, then check the color breakdown.`}
          href={`/practice?unit=${currentUnit.unit}`}
          label="Start practice"
          tone="sky"
        />
        <ActionCard
          title="3. Repair"
          body="Review weak patterns from wrong answers and update the next study target."
          href="/wrong-answers"
          label="Review weaknesses"
          tone="coral"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Unit Roadmap</h3>
            <span className="text-sm text-ink/55">{units.length} units</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {units.map((unit) => (
              <div
                key={unit.unit}
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
                  Mastery {unit.mastery}% ·{" "}
                  {coverageByUnit.get(unit.unit) ?? 0} questions
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/units/unit-${unit.unit}`}
                    className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-ink/70 ring-1 ring-ink/10 transition hover:bg-mist"
                  >
                    Read
                  </Link>
                  <Link
                    href={`/practice?unit=${unit.unit}`}
                    className="rounded-md bg-leaf px-3 py-2 text-xs font-semibold text-white transition hover:bg-leaf/90"
                  >
                    Practice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
            <h3 className="text-lg font-bold text-ink">Weakness Ranking</h3>
            <div className="mt-4 space-y-3">
              {weaknessRanking.map((weakness, index) => (
                <Link
                  key={weakness.label}
                  href={`/practice?unit=${weakness.units.sort((a, b) => a - b)[0]}`}
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
                </Link>
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
              Full textbook skeleton: {allUnits.length} units.
              Average active mastery: {averageMastery}%.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionCard({
  title,
  body,
  href,
  label,
  tone
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  tone: "leaf" | "sky" | "coral";
}) {
  const colors = {
    leaf: "text-leaf",
    sky: "text-sky",
    coral: "text-coral"
  };

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <h3 className={`text-lg font-bold ${colors[tone]}`}>{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-flex rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-mist"
      >
        {label}
      </Link>
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
