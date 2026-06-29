import Link from "next/link";
import { getWrongAnswersByCategory } from "@/lib/content";

const categories = ["Wish", "Conditionals", "Passive", "Modal Verbs"] as const;

export default function WrongAnswersPage() {
  const groups = getWrongAnswersByCategory();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-coral">
          Error bank
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Wrong Answers</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          Review mistakes by grammar category. Each card keeps the original
          wrong answer, correction, and a short reason.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((category) => (
          <section
            key={category}
            className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink">{category}</h3>
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink/60">
                {groups[category].length} items
              </span>
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
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
