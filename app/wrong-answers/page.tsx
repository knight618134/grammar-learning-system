import Link from "next/link";
import { getWrongAnswersByCategory } from "@/lib/content";

const categories = ["Wish", "Conditionals", "Passive", "Modal Verbs"] as const;

export default function WrongAnswersPage() {
  const groups = getWrongAnswersByCategory();
  const total = Object.values(groups).flat().length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">
          Error bank
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">錯題不是倉庫，是下一次練習</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          錯題依文法概念分組，保留原答案、正解與原因。每一組都能直接帶回
          Practice，集中重練相關單元。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/practice"
            className="rounded-md bg-leaf px-3 py-2 text-sm font-semibold text-white"
          >
            開始綜合練習
          </Link>
          <Link
            href="/"
            className="rounded-md bg-mist px-3 py-2 text-sm font-semibold text-ink/65"
          >
            回 Dashboard
          </Link>
          <span className="rounded-md bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
            共 {total} 題待複習
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((category) => (
          <section
            key={category}
            className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-ink">{category}</h3>
                <p className="mt-1 text-xs text-ink/50">
                  Units{" "}
                  {Array.from(new Set(groups[category].map((item) => item.unit)))
                    .sort((a, b) => a - b)
                    .join(", ")}
                </p>
              </div>
              <Link
                href={`/practice?units=${Array.from(
                  new Set(groups[category].map((item) => item.unit))
                ).join(",")}`}
                className="rounded-md bg-coral/10 px-3 py-2 text-xs font-semibold text-coral transition hover:bg-coral hover:text-white"
              >
                重練這一組 →
              </Link>
            </div>
            <div className="space-y-3">
              {groups[category].map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-ink/10 bg-mist/35 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/units/unit-${item.unit}`}
                      className="text-sm font-semibold text-leaf hover:underline"
                    >
                      Unit {item.unit}
                    </Link>
                    <span className="text-xs font-semibold text-coral">
                      Severity {item.severity}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-ink">
                    {item.prompt}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="rounded-md bg-coral/10 p-2 text-coral">
                      Wrong: {item.wrongAnswer}
                    </p>
                    <p className="rounded-md bg-leaf/10 p-2 text-leaf">
                      Correct: {item.correctAnswer}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    {item.note}
                  </p>
                  <div className="mt-3 flex gap-3 border-t border-ink/10 pt-3">
                    <Link
                      href={`/practice?unit=${item.unit}`}
                      className="text-xs font-semibold text-coral hover:underline"
                    >
                      練 Unit {item.unit}
                    </Link>
                    <Link
                      href={`/units/unit-${item.unit}`}
                      className="text-xs font-semibold text-leaf hover:underline"
                    >
                      回章節複習
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
