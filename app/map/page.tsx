import Link from "next/link";
import { getContentStatus, getProgress, getUnits } from "@/lib/content";

const learningTracks = [
  {
    label: "時間與動作",
    en: "Tenses & Future",
    parts: ["Present and past", "Future"],
    color: "sky",
    summary: "先決定動作在時間軸上的位置，再選簡單式、進行式、完成式或未來表達。"
  },
  {
    label: "語氣與可能性",
    en: "Modals",
    parts: ["Modals"],
    color: "gold",
    summary: "能力、推論、義務、建議、請求與禮貌程度。"
  },
  {
    label: "假設與願望",
    en: "Conditionals & Wish",
    parts: ["Conditionals and wish"],
    color: "coral",
    summary: "從真實條件一路到現在反事實、過去反事實與後悔。"
  },
  {
    label: "動作焦點",
    en: "Passive & Reported Speech",
    parts: ["Passive", "Reported speech"],
    color: "leaf",
    summary: "改變句子的焦點：強調承受者，或轉述別人的話。"
  },
  {
    label: "句子骨架",
    en: "Questions & Verb Patterns",
    parts: ["Questions and auxiliaries", "Verb patterns"],
    color: "sky",
    summary: "問句、助動詞，以及動詞後面究竟接 to V、V-ing 或受詞。"
  },
  {
    label: "名詞世界",
    en: "Nouns, Pronouns & Clauses",
    parts: ["Articles and nouns", "Pronouns and determiners", "Relative clauses"],
    color: "gold",
    summary: "冠詞、數量、指涉與關係子句，共同決定「你說的是哪一個」。"
  },
  {
    label: "修飾與連接",
    en: "Modifiers & Flow",
    parts: ["Adjectives and adverbs", "Conjunctions and word order"],
    color: "coral",
    summary: "描述得更準確，並用正確字序與連接詞組織想法。"
  },
  {
    label: "搭配與語感",
    en: "Prepositions & Phrasal Verbs",
    parts: ["Prepositions", "Phrasal verbs"],
    color: "leaf",
    summary: "介系詞與片語動詞不是逐字翻譯，而是以搭配為單位記憶。"
  }
] as const;

const tones = {
  sky: {
    border: "border-sky/30",
    bg: "bg-sky/5",
    node: "bg-sky text-white",
    text: "text-sky",
    line: "bg-sky/30"
  },
  gold: {
    border: "border-gold/30",
    bg: "bg-gold/5",
    node: "bg-gold text-white",
    text: "text-gold",
    line: "bg-gold/30"
  },
  coral: {
    border: "border-coral/30",
    bg: "bg-coral/5",
    node: "bg-coral text-white",
    text: "text-coral",
    line: "bg-coral/30"
  },
  leaf: {
    border: "border-leaf/30",
    bg: "bg-leaf/5",
    node: "bg-leaf text-white",
    text: "text-leaf",
    line: "bg-leaf/30"
  }
};

export default function GrammarMapPage() {
  const units = getUnits();
  const progress = new Map(getProgress().map((unit) => [unit.unit, unit]));
  const content = new Map(
    getContentStatus().map((record) => [record.unit, record.level])
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
          Grammar Mind Map
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">英文文法全貌</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
          這不是課本目錄。中央是完整文法系統，向外分成八個概念群組；每個群組再分支到相關單元。
          點章節學習，或把整個相似群組一起加入測驗。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
            方塊 = 可學習節點
          </span>
          <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">
            同一大框 = 適合混合練習
          </span>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
            共 {units.length} 個單元
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft">
        <div className="overflow-x-auto p-5 md:p-8">
          <div className="mx-auto min-w-0 max-w-6xl md:min-w-[760px]">
            <div className="mx-auto mb-10 w-64 rounded-2xl border-4 border-leaf/20 bg-leaf px-6 py-5 text-center text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Grammar System
              </p>
              <h3 className="mt-1 text-2xl font-bold">英文文法</h3>
              <p className="mt-1 text-xs text-white/80">Units 1–145</p>
            </div>

            <div className="relative grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-20 md:gap-y-8">
              <div className="absolute bottom-6 left-1/2 top-[-42px] hidden w-px -translate-x-1/2 bg-leaf/20 md:block" />
              {learningTracks.map((track, index) => {
                const trackUnits = units.filter((unit) =>
                  track.parts.includes(unit.part as never)
                );
                const tone = tones[track.color];
                const unitParam = trackUnits.map((unit) => unit.unit).join(",");
                const isLeft = index % 2 === 0;
                return (
                  <article
                    key={track.label}
                    className={`relative rounded-2xl border-2 p-4 ${tone.border} ${tone.bg}`}
                  >
                    <div
                      className={`absolute top-8 hidden h-px w-10 md:block ${tone.line} ${
                        isLeft ? "-right-10" : "-left-10"
                      }`}
                    />
                    <div
                      className={`absolute top-[29px] hidden h-2.5 w-2.5 rounded-full md:block ${tone.node} ${
                        isLeft ? "-right-[45px]" : "-left-[45px]"
                      }`}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide ${tone.text}`}>
                          {track.en}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-ink">
                          {track.label}
                        </h3>
                      </div>
                      <Link
                        href={`/practice?units=${unitParam}`}
                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${tone.node}`}
                      >
                        整組測驗
                      </Link>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-ink/60">
                      {track.summary}
                    </p>

                    <div className="mt-4 space-y-3">
                      {track.parts.map((part) => {
                        const partUnits = trackUnits.filter(
                          (unit) => unit.part === part
                        );
                        return (
                          <div key={part} className="rounded-xl bg-white/80 p-3 ring-1 ring-ink/10">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${tone.node}`} />
                              <h4 className="text-sm font-bold text-ink">{part}</h4>
                              <span className="ml-auto text-xs text-ink/45">
                                {partUnits.length} units
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {partUnits.map((unit) => {
                                const state = progress.get(unit.unit);
                                const level = content.get(unit.unit);
                                return (
                                  <Link
                                    key={unit.unit}
                                    href={`/units/${unit.slug}`}
                                    title={`Unit ${unit.unit}: ${unit.title}`}
                                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-soft ${
                                      state?.status === "completed"
                                        ? "border-leaf bg-leaf text-white"
                                        : state?.status === "in_progress"
                                          ? "border-gold bg-gold text-white"
                                          : level === "deep_notes"
                                            ? `${tone.border} bg-white ${tone.text}`
                                            : "border-ink/10 bg-mist/70 text-ink/55"
                                    }`}
                                  >
                                    {unit.unit}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
