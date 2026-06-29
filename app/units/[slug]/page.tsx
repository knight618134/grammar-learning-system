import { notFound } from "next/navigation";
import { MarkdownBlock } from "@/components/MarkdownBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { UnitNav } from "@/components/UnitNav";
import {
  getMissingSections,
  getProgress,
  getUnitContent,
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
  const missingSections = getMissingSections(unit);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <UnitNav units={units} activeUnit={unit.unit} />
      <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
              Unit {unit.unit}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">{unit.title}</h2>
            <p className="mt-3 text-sm text-ink/60">
              Mastery {progress.mastery}% · Local MDX content
            </p>
          </div>
          <StatusBadge status={progress.status} />
        </div>

        {missingSections.length > 0 ? (
          <div className="mt-6 rounded-md border border-coral/20 bg-coral/5 p-4 text-sm text-coral">
            Missing sections: {missingSections.join(", ")}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4">
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
