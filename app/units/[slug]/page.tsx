import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownBlock } from "@/components/MarkdownBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { UnitNav } from "@/components/UnitNav";
import {
  getActiveStudyUnits,
  getQuizQuestionsByUnit,
  getMissingSections,
  getProgress,
  getUnitContent,
  getUnitConfusingPatterns,
  getUnitSlugs
} from "@/lib/content";

export function generateStaticParams() {
  return getUnitSlugs().map((slug) => ({ slug }));
}

export default async function UnitPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const units = getProgress();
  const progress = units.find((unit) => `unit-${unit.unit}` === slug);

  if (!progress || !getUnitSlugs().includes(slug)) {
    notFound();
  }

  const unit = getUnitContent(slug);
  const practiceQuestions = getQuizQuestionsByUnit(unit.unit);
  const confusingPatterns = getUnitConfusingPatterns(progress);
  const missingSections = getMissingSections(unit);
  const activeStudyUnits = getActiveStudyUnits();
  const navUnits = activeStudyUnits.some((item) => item.unit === unit.unit)
    ? activeStudyUnits
    : units.filter((item) => item.part === progress.part);
  const relatedUnits = units
    .filter((item) => item.part === progress.part)
    .map((item) => item.unit);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <UnitNav units={navUnits} activeUnit={unit.unit} />
      <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
              Unit {unit.unit}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">{unit.title}</h2>
            <p className="mt-3 text-sm text-ink/60">
              Mastery {progress.mastery}% · {practiceQuestions.length} practice
              questions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/practice?unit=${unit.unit}`}
              className="rounded-md bg-leaf px-3 py-2 text-sm font-semibold text-white transition hover:bg-leaf/90"
            >
              Practice Unit {unit.unit}
            </Link>
            <Link
              href={`/practice?units=${relatedUnits.join(",")}`}
              className="rounded-md bg-sky/10 px-3 py-2 text-sm font-semibold text-sky transition hover:bg-sky hover:text-white"
            >
              同類單元混合考
            </Link>
            <StatusBadge status={progress.status} />
          </div>
        </div>

        {missingSections.length > 0 ? (
          <div className="mt-6 rounded-md border border-coral/20 bg-coral/5 p-4 text-sm text-coral">
            Missing sections: {missingSections.join(", ")}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4">
          <section className="rounded-lg border border-sky/20 bg-sky/5 p-5">
            <h3 className="text-lg font-bold text-ink">
              例句與易混淆重點
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-sky">
                  Easy-to-confuse patterns
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
                  {confusingPatterns.map((pattern) => (
                    <li key={pattern}>- {pattern}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-sky">
                  本章句型檢查（共 {practiceQuestions.length} 題）
                </p>
                <div className="mt-3 space-y-2">
                  {practiceQuestions.slice(0, 5).map((question) => (
                    <Link
                      key={question.id}
                      href={`/practice?unit=${unit.unit}`}
                      className="block rounded-md bg-white p-3 text-sm transition hover:bg-mist"
                    >
                      <span className="font-semibold text-ink">
                        {question.prompt}
                      </span>
                      <span className="mt-1 block text-xs text-ink/55">
                        {question.source} · 答案：{question.answer}
                      </span>
                    </Link>
                  ))}
                  {practiceQuestions.length === 0 ? (
                    <p className="rounded-md bg-white p-3 text-sm text-ink/60">
                      Practice questions for this unit are not ready yet.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {unit.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-ink/10 bg-mist/35 p-5"
            >
              <h3 className="text-lg font-bold text-ink">{section.title}</h3>
              <div className="mt-3">
                <MarkdownBlock body={section.body} />
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
