import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const unitsPath = path.join(rootDir, "data", "units.json");
const questionsPath = path.join(rootDir, "data", "quiz-questions.json");

const unitsData = JSON.parse(fs.readFileSync(unitsPath, "utf8"));
const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

const existingUnits = new Set(
  questionsData.questions.map((question) => question.unit)
);

const templates = {
  "Present and past": {
    topic: "Tenses",
    prompt: "Which question should you ask first when choosing the tense?",
    choices: [
      "When does the action happen?",
      "Is the sentence long?",
      "Can I translate it word by word?",
      "Does the verb sound familiar?"
    ],
    answer: "When does the action happen?",
    explanationEn:
      "Tense choices start from time and connection to now, not from direct translation.",
    explanationZh:
      "時態判斷先看時間與是否連到現在，不是直接照中文翻。",
    phraseNote: "Ask: past, present, future, or connected to now?"
  },
  Future: {
    topic: "Future",
    prompt: "Which sentence pattern is safest after when in a future time clause?",
    choices: [
      "when I finish",
      "when I will finish",
      "when I am finish",
      "when I finished yesterday"
    ],
    answer: "when I finish",
    explanationEn:
      "Future time clauses after when use present forms, even when the meaning is future.",
    explanationZh:
      "when 引導未來時間子句時，用現在式表未來，不直接用 will。",
    phraseNote: "Call me when you finish is natural workplace English."
  },
  Modals: {
    topic: "Modal Verbs",
    prompt: "Which structure is correct after a modal verb?",
    choices: [
      "modal + base verb",
      "modal + to + verb",
      "modal + verb-ing",
      "modal + past tense only"
    ],
    answer: "modal + base verb",
    explanationEn:
      "Most modal verbs are followed by the base form: can go, should check, must finish.",
    explanationZh:
      "情態助動詞後面通常接原形動詞：can go, should check, must finish。",
    phraseNote: "should check / can do / must finish are core modal patterns."
  },
  "Conditionals and wish": {
    topic: "Conditionals",
    prompt: "Which timeline does if + had done usually describe?",
    choices: [
      "an unreal past situation",
      "a daily habit",
      "a certain future plan",
      "a general fact"
    ],
    answer: "an unreal past situation",
    explanationEn:
      "If + had done usually sets up an unreal past condition or regret.",
    explanationZh:
      "if + had done 通常表示過去反事實或後悔。",
    phraseNote: "If I had known..., I would have..."
  },
  Passive: {
    topic: "Passive",
    prompt: "Which sentence is passive?",
    choices: [
      "The report was checked.",
      "Jason checked the report.",
      "Jason is checking the report.",
      "Jason will check the report."
    ],
    answer: "The report was checked.",
    explanationEn:
      "Passive focuses on the receiver of the action and uses be + past participle.",
    explanationZh:
      "被動語態聚焦承受動作的人事物，形式是 be + 過去分詞。",
    phraseNote: "was checked / is reviewed / should be updated"
  },
  "Reported speech": {
    topic: "Reported Speech",
    prompt: "What usually changes when direct speech becomes reported speech?",
    choices: ["tense and pronouns", "only punctuation", "only spelling", "nothing"],
    answer: "tense and pronouns",
    explanationEn:
      "Reported speech often changes tense, pronouns, and time expressions.",
    explanationZh:
      "轉述句常需要調整時態、代名詞和時間副詞。",
    phraseNote: "He said that... / She told me that..."
  },
  "Questions and auxiliaries": {
    topic: "Questions",
    prompt: "Which form is a natural yes/no question?",
    choices: [
      "Do you have a minute?",
      "You have a minute?",
      "Have you a minute do?",
      "Are you have a minute?"
    ],
    answer: "Do you have a minute?",
    explanationEn:
      "Present simple questions normally use do/does before the subject.",
    explanationZh:
      "一般現在式問句通常用 do/does 放在主詞前面。",
    phraseNote: "Do you have a minute? is a useful daily work phrase."
  },
  "Verb patterns": {
    topic: "Verb Patterns",
    prompt: "Which pattern should you check after a main verb?",
    choices: [
      "whether it takes to V or V-ing",
      "whether the sentence is long",
      "whether the noun is plural only",
      "whether there is a comma"
    ],
    answer: "whether it takes to V or V-ing",
    explanationEn:
      "Many verbs require a specific following form, such as decide to do or enjoy doing.",
    explanationZh:
      "很多動詞後面固定接 to V 或 V-ing，例如 decide to do、enjoy doing。",
    phraseNote: "decide to do / enjoy doing / avoid doing"
  },
  "Articles and nouns": {
    topic: "Articles and Nouns",
    prompt: "What should you check before choosing a/an, the, or no article?",
    choices: [
      "whether the noun is specific and countable",
      "whether the verb is passive",
      "whether the sentence has if",
      "whether the word is long"
    ],
    answer: "whether the noun is specific and countable",
    explanationEn:
      "Article choices depend on countability, singular/plural form, and whether the noun is specific.",
    explanationZh:
      "冠詞選擇要看可不可數、單複數，以及是不是特定的人事物。",
    phraseNote: "a problem / the problem / advice"
  },
  "Pronouns and determiners": {
    topic: "Pronouns and Determiners",
    prompt: "What is the main job of pronouns and determiners?",
    choices: [
      "to show which person or thing we mean",
      "to make every verb passive",
      "to create future tense",
      "to replace all prepositions"
    ],
    answer: "to show which person or thing we mean",
    explanationEn:
      "Pronouns and determiners help identify people, things, quantity, and ownership.",
    explanationZh:
      "代名詞和限定詞用來指出人物、事物、數量或所有關係。",
    phraseNote: "my own / each / every / both / neither"
  },
  "Relative clauses": {
    topic: "Relative Clauses",
    prompt: "What does a relative clause usually do?",
    choices: [
      "adds information about a noun",
      "makes a verb future",
      "turns a noun into an adverb",
      "removes the subject"
    ],
    answer: "adds information about a noun",
    explanationEn:
      "Relative clauses describe or identify a noun using words like who, which, that, where, or whose.",
    explanationZh:
      "關係子句用 who、which、that、where、whose 等補充或限定名詞。",
    phraseNote: "the person who... / the file that..."
  },
  "Adjectives and adverbs": {
    topic: "Adjectives and Adverbs",
    prompt: "Which word usually describes a verb?",
    choices: ["an adverb", "an article", "a modal", "a subject"],
    answer: "an adverb",
    explanationEn:
      "Adverbs often describe verbs, adjectives, or whole sentences.",
    explanationZh:
      "副詞常修飾動詞、形容詞或整個句子。",
    phraseNote: "work carefully / extremely useful / probably true"
  },
  "Conjunctions and word order": {
    topic: "Conjunctions and Word Order",
    prompt: "What should you check when a sentence has connectors like although or because?",
    choices: [
      "the relationship between clauses",
      "only the spelling of the verb",
      "whether every noun has the",
      "whether the sentence is passive"
    ],
    answer: "the relationship between clauses",
    explanationEn:
      "Connectors show contrast, reason, condition, time, or result between clauses.",
    explanationZh:
      "連接詞表示子句之間的對比、原因、條件、時間或結果。",
    phraseNote: "although / because / unless / as long as"
  },
  Prepositions: {
    topic: "Prepositions",
    prompt: "Why are prepositions difficult to translate directly?",
    choices: [
      "because they often depend on fixed collocations",
      "because they always show past time",
      "because they are always passive",
      "because they replace verbs"
    ],
    answer: "because they often depend on fixed collocations",
    explanationEn:
      "Prepositions often follow collocation patterns rather than word-by-word Chinese translation.",
    explanationZh:
      "介系詞常靠固定搭配，不適合逐字從中文翻。",
    phraseNote: "interested in / responsible for / depend on"
  },
  "Phrasal verbs": {
    topic: "Phrasal Verbs",
    prompt: "What often changes the meaning of a phrasal verb?",
    choices: ["the particle", "the article a", "the comma", "the capital letter"],
    answer: "the particle",
    explanationEn:
      "Particles like up, out, on, off, back, and away can change the meaning of the verb.",
    explanationZh:
      "up、out、on、off、back、away 這些小品詞會改變片語動詞意思。",
    phraseNote: "give up / find out / turn on / get back"
  }
};

function makeBreakdown(unit, template) {
  return [
    {
      label: "unit focus",
      text: `Unit ${unit.unit} focuses on ${unit.title}. First identify the grammar family: ${unit.part}.`,
      tone: "clue"
    },
    {
      label: "pattern",
      text: template.explanationEn,
      tone: "structure"
    },
    {
      label: "correct choice",
      text: `The correct answer is "${template.answer}" because it matches the core pattern for this unit family.`,
      tone: "answer"
    },
    {
      label: "Jason warning",
      text: "Do not choose by Chinese translation only. Compare the form of each option first.",
      tone: "warning"
    }
  ];
}

const generated = [];

for (const unit of unitsData.units) {
  if (existingUnits.has(unit.unit)) {
    continue;
  }

  const template = templates[unit.part] ?? templates["Verb patterns"];

  generated.push({
    id: `starter-unit-${String(unit.unit).padStart(3, "0")}`,
    unit: unit.unit,
    source: "Grammar",
    topic: template.topic,
    prompt: `Unit ${unit.unit}: ${template.prompt}`,
    choices: template.choices,
    answer: template.answer,
    explanationEn: template.explanationEn,
    explanationZh: template.explanationZh,
    phraseNote: template.phraseNote,
    breakdown: makeBreakdown(unit, template)
  });
}

questionsData.questions = [...questionsData.questions, ...generated].sort(
  (a, b) => a.unit - b.unit || a.id.localeCompare(b.id)
);

fs.writeFileSync(questionsPath, `${JSON.stringify(questionsData, null, 2)}\n`);

console.log(`Added ${generated.length} starter questions.`);
