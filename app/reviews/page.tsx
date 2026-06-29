import Link from "next/link";
import { getReviewRecords } from "@/lib/content";

export default function ReviewsPage() {
  const reviews = getReviewRecords();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky">
          Test history
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Review Tests</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          Store Unit 42 and Unit 43 review records locally and check accuracy at
          a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => {
          const accuracy = Math.round((review.score / review.total) * 100);

          return (
            <article
              key={review.unit}
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-leaf">
                    Unit {review.unit}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-ink">
                    {review.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/55">{review.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-sky">{accuracy}%</p>
                  <p className="text-xs text-ink/55">
                    {review.score}/{review.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 h-2 rounded-full bg-ink/10">
                <div
                  className="h-2 rounded-full bg-sky"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {review.focus.map((focus) => (
                  <span
                    key={focus}
                    className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink/65"
                  >
                    {focus}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/70">{review.notes}</p>
              <Link
                href={`/units/unit-${review.unit}`}
                className="mt-5 inline-flex rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold text-ink transition hover:border-sky/30 hover:bg-sky/10 hover:text-sky"
              >
                Open Unit {review.unit}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
