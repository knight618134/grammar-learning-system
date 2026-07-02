import type { QuizQuestion, QuizSource, UnitMetadata } from "@/lib/types";

type Check = {
  prompt: string;
  choices: string[];
  answer: string;
  en: string;
  zh: string;
};

const banks: Record<string, Check[]> = {
  time: [
    { prompt: "Which clue matters most when choosing a tense?", choices: ["the time relationship", "sentence length", "punctuation", "word count"], answer: "the time relationship", en: "Tense expresses time and the relationship between events.", zh: "時態要先看時間，以及事件彼此的先後或延續關係。" },
    { prompt: "Which contrast should you check before choosing simple or continuous?", choices: ["habit/state vs action in progress", "singular vs plural noun", "active vs passive only", "formal vs informal spelling"], answer: "habit/state vs action in progress", en: "Simple forms often describe facts or habits; continuous forms show activity in progress.", zh: "簡單式常表事實或習慣；進行式強調正在進行的活動。" },
    { prompt: "What is the key contrast between past simple and present perfect?", choices: ["finished past time vs connection to now", "active vs passive", "adjective vs adverb", "request vs command"], answer: "finished past time vs connection to now", en: "Past simple belongs to a finished past time; present perfect connects the past to now.", zh: "過去簡單式屬於已結束的過去；現在完成式把過去連到現在。" },
    { prompt: "In a future time clause after when, which form is normally used?", choices: ["present form", "will + verb", "past perfect only", "would + verb"], answer: "present form", en: "Future time clauses normally use a present form after when, before, or as soon as.", zh: "when、before、as soon as 引導未來時間子句時通常用現在式。" }
  ],
  modal: [
    { prompt: "What form follows can, should, must, may, or might?", choices: ["base verb", "to + verb", "verb-ing", "past tense"], answer: "base verb", en: "Core modals are followed by the base form.", zh: "核心情態助動詞後面接原形動詞。" },
    { prompt: "Which expression means something is prohibited?", choices: ["mustn't", "don't have to", "might not", "couldn't have"], answer: "mustn't", en: "Mustn't means prohibited; don't have to means not necessary.", zh: "mustn't 是禁止；don't have to 是沒有必要。" },
    { prompt: "Which structure talks about a possible or regretted past?", choices: ["modal + have + past participle", "modal + to + verb", "modal + verb-ing", "modal + past tense"], answer: "modal + have + past participle", en: "Modal + have + past participle looks back at the past.", zh: "情態助動詞 + have + 過去分詞用來回看過去。" },
    { prompt: "Which request is the most polite?", choices: ["Could you help me?", "Help me.", "You help me.", "Must you help me?"], answer: "Could you help me?", en: "Could you...? is a common polite request.", zh: "Could you...? 是常見且自然的禮貌請求。" }
  ],
  conditional: [
    { prompt: "Which pattern describes a real possible future condition?", choices: ["if + present, will + base verb", "if + past perfect, would", "if + will, will", "if + present, would have"], answer: "if + present, will + base verb", en: "A real future condition uses present in the if-clause.", zh: "真實未來條件在 if 子句用現在式。" },
    { prompt: "Which pattern describes an unreal present situation?", choices: ["if + past, would + base verb", "if + present, will", "if + past perfect, would have", "if + will, would"], answer: "if + past, would + base verb", en: "Past form after if can mark distance from present reality.", zh: "if 後用過去式可表達與現在事實有距離的假設。" },
    { prompt: "Which pattern describes an unreal past?", choices: ["if + had done, would have done", "if + did, will do", "if + has done, would do", "if + will do, did"], answer: "if + had done, would have done", en: "The third conditional imagines a different past result.", zh: "第三條件句想像一個不同的過去結果。" },
    { prompt: "I wish I ___ more time now.", choices: ["had", "have", "will have", "had had"], answer: "had", en: "Wish + past describes an unreal present.", zh: "wish + 過去式表示與現在事實相反的願望。" }
  ],
  passive: [
    { prompt: "What is the core passive structure?", choices: ["be + past participle", "have + base verb", "do + verb-ing", "be + base verb"], answer: "be + past participle", en: "The tense appears on be; the main verb is a past participle.", zh: "被動時態放在 be 上，主要動詞使用過去分詞。" },
    { prompt: "Which sentence correctly uses a modal passive?", choices: ["It should be checked.", "It should checked.", "It should be check.", "It should to be checked."], answer: "It should be checked.", en: "Modal passive is modal + be + past participle.", zh: "情態助動詞被動是 modal + be + 過去分詞。" },
    { prompt: "Which form emphasizes an action in progress in the passive?", choices: ["being done", "been done", "be do", "having do"], answer: "being done", en: "Being done is the continuous passive form.", zh: "being done 是進行中的被動形式。" },
    { prompt: "When is by + agent most useful?", choices: ["when the doer is important information", "in every passive sentence", "only in questions", "only with future tense"], answer: "when the doer is important information", en: "Omit the agent when it is unknown, obvious, or unimportant.", zh: "執行者未知、明顯或不重要時，不必加 by + 執行者。" }
  ],
  mechanics: [
    { prompt: "What normally comes before the subject in a yes/no question?", choices: ["an auxiliary verb", "an adjective", "a preposition", "an article"], answer: "an auxiliary verb", en: "Questions normally invert the subject and an auxiliary.", zh: "一般問句會把助動詞移到主詞前。" },
    { prompt: "What should you memorize with a main verb?", choices: ["its following pattern", "its number of letters", "its first vowel", "its punctuation"], answer: "its following pattern", en: "Learn whether a verb takes to V, V-ing, or an object.", zh: "動詞要連同後接 to V、V-ing 或受詞的句型一起記。" },
    { prompt: "Which pattern is correct?", choices: ["enjoy doing", "enjoy to do", "enjoy do", "enjoy did"], answer: "enjoy doing", en: "Enjoy is followed by an -ing form.", zh: "enjoy 後面接 V-ing。" },
    { prompt: "What may change in reported speech?", choices: ["tense, pronouns, and time words", "only spelling", "only commas", "nothing"], answer: "tense, pronouns, and time words", en: "Reported speech often shifts viewpoint and time reference.", zh: "轉述句常調整時態、代名詞與時間詞。" }
  ],
  noun: [
    { prompt: "What must you check before choosing a/an?", choices: ["singular countability", "passive voice", "future time", "word order only"], answer: "singular countability", en: "A/an is used with a singular countable noun.", zh: "a/an 用於單數可數名詞。" },
    { prompt: "When does the usually work?", choices: ["when the listener can identify the noun", "with every plural noun", "with every name", "only in questions"], answer: "when the listener can identify the noun", en: "The marks a noun as identifiable in context.", zh: "the 表示聽者能從語境辨認出該名詞。" },
    { prompt: "What does a relative clause do?", choices: ["describes or identifies a noun", "creates future tense", "replaces every verb", "makes a command"], answer: "describes or identifies a noun", en: "Relative clauses add identifying or extra information about nouns.", zh: "關係子句用來限定或補充名詞資訊。" },
    { prompt: "Which pair refers to two alternatives?", choices: ["either / neither", "much / little", "who / which", "a / an"], answer: "either / neither", en: "Either and neither are used when considering two.", zh: "either 與 neither 用於兩者之間的選擇或否定。" }
  ],
  modifier: [
    { prompt: "Which word normally describes a verb?", choices: ["an adverb", "an article", "a noun clause", "a modal"], answer: "an adverb", en: "Adverbs can modify verbs, adjectives, or whole clauses.", zh: "副詞可以修飾動詞、形容詞或整個子句。" },
    { prompt: "Which adjective describes how a person feels?", choices: ["bored", "boring", "bore", "boringly person"], answer: "bored", en: "-ed adjectives often describe a person's feeling.", zh: "-ed 形容詞常描述人的感受。" },
    { prompt: "What does although introduce?", choices: ["contrast", "cause", "purpose", "quantity"], answer: "contrast", en: "Although connects two contrasting ideas.", zh: "although 用來連接互相對比的想法。" },
    { prompt: "Which structure is correct?", choices: ["too difficult to finish", "too difficult that finish", "enough difficult finish", "so difficult to finishing"], answer: "too difficult to finish", en: "Too + adjective + to V means more than is acceptable or possible.", zh: "too + 形容詞 + to V 表示程度過高而無法完成。" }
  ],
  collocation: [
    { prompt: "How should prepositions usually be learned?", choices: ["as part of a collocation", "by direct translation only", "alphabetically only", "as verb tenses"], answer: "as part of a collocation", en: "Learn the whole chunk, such as interested in or responsible for.", zh: "介系詞應以完整搭配學習，例如 interested in。" },
    { prompt: "What can change a phrasal verb's meaning?", choices: ["its particle", "capitalization", "an article", "a comma"], answer: "its particle", en: "Particles such as up, out, on, and off create new meanings.", zh: "up、out、on、off 等小品詞會改變片語動詞意思。" },
    { prompt: "Which collocation is correct?", choices: ["responsible for", "responsible of", "responsible at", "responsible to doing"], answer: "responsible for", en: "Responsible for is a fixed adjective-preposition combination.", zh: "responsible for 是固定的形容詞與介系詞搭配。" },
    { prompt: "Which phrase means discover information?", choices: ["find out", "find on", "find up", "find away"], answer: "find out", en: "Find out means discover or learn information.", zh: "find out 表示查明或得知資訊。" }
  ]
};

function bankKey(part: string) {
  if (["Present and past", "Future"].includes(part)) return "time";
  if (part === "Modals") return "modal";
  if (part === "Conditionals and wish") return "conditional";
  if (part === "Passive") return "passive";
  if (["Reported speech", "Questions and auxiliaries", "Verb patterns"].includes(part)) return "mechanics";
  if (["Articles and nouns", "Pronouns and determiners", "Relative clauses"].includes(part)) return "noun";
  if (["Adjectives and adverbs", "Conjunctions and word order"].includes(part)) return "modifier";
  return "collocation";
}

export function expandPracticeBank(
  units: UnitMetadata[],
  seed: QuizQuestion[]
): QuizQuestion[] {
  const seedByUnit = new Map(seed.map((question) => [question.unit, question]));
  const sources: QuizSource[] = ["Grammar", "Daily English", "TOEIC", "Native Usage"];

  return units.flatMap((unit) => {
    const original = seedByUnit.get(unit.unit);
    const generated = banks[bankKey(unit.part)].map((check, index) => ({
      id: `concept-unit-${unit.unit}-${index + 1}`,
      unit: unit.unit,
      source: sources[index],
      topic: unit.part,
      prompt: `Unit ${unit.unit} · ${unit.title}: ${check.prompt}`,
      choices: check.choices,
      answer: check.answer,
      explanationEn: check.en,
      explanationZh: check.zh,
      breakdown: [
        { label: "chapter", text: `This check belongs to ${unit.title}.`, tone: "clue" as const },
        { label: "rule", text: check.en, tone: "structure" as const }
      ]
    }));
    return original ? [original, ...generated] : generated;
  });
}
