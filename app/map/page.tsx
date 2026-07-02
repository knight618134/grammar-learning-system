import Link from "next/link";
import {
  getContentLevelDescriptions,
  getContentStatus,
  getProgress,
  getUnits
} from "@/lib/content";
import type { ContentLevel, UnitStatus } from "@/lib/types";

const learningTracks = [
  {
    label: "Tenses / 時態",
    parts: ["Present and past", "Future"],
    summary: "先建立時間感：現在、過去、完成式、未來安排與未來時間子句。"
  },
  {
    label: "Modals / 情態助動詞",
    parts: ["Modals"],
    summary: "表達能力、推論、義務、建議、請求，也是 Jason 目前很重要的弱點區。"
  },
  {
    label: "Conditionals + Wish / 假設與願望",
    parts: ["Conditionals and wish"],
    summary: "把真實、假設現在、假設過去分清楚，避免只靠中文直翻。"
  },
  {
    label: "Passive / 被動語態",
    parts: ["Passive"],
    summary: "辨認誰承受動作，熟悉 be done、modal + be done、have something done。"
  },
  {
    label: "Sentence Mechanics / 句子機械結構",
    parts: ["Reported speech", "Questions and auxiliaries", "Verb patterns"],
    summary: "處理轉述、問句、助動詞回應、to V / V-ing 等句型骨架。"
  },
  {
    label: "Nouns + Clauses / 名詞與子句",
    parts: ["Articles and nouns", "Pronouns and determiners", "Relative clauses"],
    summary: "冠詞、名詞數量、代名詞、關係子句，影響閱讀精準度。"
  },
  {
    label: "Modifiers + Flow / 修飾與語氣流動",
    parts: ["Adjectives and adverbs", "Conjunctions and word order"],
    summary: "形容詞、副詞、連接詞和字序，讓句子更像自然英文。"
  },
  {
    label: "Prepositions + Phrasal Verbs / 介系詞與片語動詞",
    parts: ["Prepositions", "Phrasal verbs"],
    summary: "偏母語使用者語感：搭配詞、介系詞、片語動詞需要長期累積。"
  }
];

export default function GrammarMapPage() {
  const units = getUnits();
  const progressByUnit = new Map(getProgress().map((unit) => [unit.unit, unit]));
  const contentByUnit = new Map(
    getContentStatus().map((record) => [record.unit, record.level])
  );
  const levelDescriptions = getContentLevelDescriptions();

  const totalDeep = getContentStatus().filter(
    (record) => record.level === "deep_notes"
  ).length;
  const totalReview = getContentStatus().filter(
    (record) => record.level === "review_notes"
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
          Grammar Map
        </p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h2 className="text-3xl font-bold text-ink">
              Textbook Units 1-145 by Grammar Family
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
              This map groups the whole book by learning track, so you can see
              which chapters are tenses, modals, conditionals, passive, sentence
              patterns, nouns, modifiers, prepositions, and phrasal verbs.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Total" value={units.length} tone="sky" />
            <MiniStat label="Deep" value={totalDeep} tone="leaf" />
            <MiniStat label="Review" value={totalReview} tone="gold" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {learningTracks.map((track) => {
          const trackUnits = units.filter((unit) =>
            track.parts.includes(unit.part)
          );
          const first = trackUnits[0]?.unit;
          const last = trackUnits[trackUnits.length - 1]?.unit;

          return (
            <article
              key={track.label}
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                    Units {first}-{last}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-ink">
                    {track.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    {track.summary}
                  </p>
                </div>
                <span className="rounded-md bg-mist px-3 py-2 text-sm font-semibold text-ink/70">
                  {trackUnits.length} units
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {track.parts.map((part) => {
                  const partUnits = trackUnits.filter((unit) => unit.part === part);
                  return (
                    <div key={part}>
                      <h4 className="text-sm font-bold text-ink">{part}</h4>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {partUnits.map((unit) => {
                          const progress = progressByUnit.get(unit.unit);
                          const level = contentByUnit.get(unit.unit) ?? "placeholder";

                          return (
                            <Link
                              key={unit.unit}
                              href={`/units/${unit.slug}`}
                              className="rounded-md border border-ink/10 bg-mist/25 p-3 transition hover:border-leaf/30 hover:bg-mist"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-ink">
                                  Unit {unit.unit}
                                </p>
                                <ContentBadge level={level} />
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/65">
                                {unit.title}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <PriorityBadge priority={unit.priority} />
                                <StatusMiniBadge
                                  status={progress?.status ?? "not_started"}
                                />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">Content Level Legend</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {(Object.entries(levelDescriptions) as Array<[ContentLevel, string]>).map(
            ([level, description]) => (
              <div key={level} className="rounded-md bg-mist/50 p-4">
                <ContentBadge level={level} />
                <p className="mt-3 text-sm leading-6 text-ink/65">{description}</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "leaf" | "gold" | "sky";
}) {
  const colors = {
    leaf: "text-leaf",
    gold: "text-gold",
    sky: "text-sky"
  };

  return (
    <div className="rounded-lg bg-mist p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${colors[tone]}`}>{value}</p>
    </div>
  );
}

function ContentBadge({ level }: { level: ContentLevel }) {
  const labels = {
    placeholder: "Skeleton",
    review_notes: "Level 2",
    deep_notes: "Level 3"
  };
  const colors = {
    placeholder: "bg-ink/5 text-ink/55",
    review_notes: "bg-gold/15 text-gold",
    deep_notes: "bg-leaf/10 text-leaf"
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

function PriorityBadge({
  priority
}: {
  priority: "foundation" | "active" | "future";
}) {
  const labels = {
    foundation: "Foundation",
    active: "Active",
    future: "Future"
  };

  return (
    <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-ink/55">
      {labels[priority]}
    </span>
  );
}

function StatusMiniBadge({ status }: { status: UnitStatus }) {
  const colors = {
    completed: "bg-leaf/10 text-leaf",
    in_progress: "bg-gold/15 text-gold",
    next: "bg-sky/10 text-sky",
    not_started: "bg-white text-ink/45"
  };
  const labels = {
    completed: "Completed",
    in_progress: "In progress",
    next: "Next",
    not_started: "Not started"
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
