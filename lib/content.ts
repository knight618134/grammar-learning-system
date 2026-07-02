import fs from "node:fs";
import path from "node:path";
import contentStatusData from "@/data/content-status.json";
import progressData from "@/data/progress.json";
import quizQuestionsData from "@/data/quiz-questions.json";
import unitsData from "@/data/units.json";
import wrongAnswersData from "@/data/wrong-answers.json";
import type {
  ContentStatusData,
  ContentStatusRecord,
  ProgressData,
  QuizQuestion,
  QuizQuestionsData,
  ReviewRecord,
  UnitContent,
  UnitMetadata,
  UnitPracticeSummary,
  UnitProgress,
  UnitsData,
  WrongAnswer,
  WrongAnswerCategory
} from "@/lib/types";

const rootDir = process.cwd();
const unitsDir = path.join(rootDir, "content", "units");
const reviewsDir = path.join(rootDir, "content", "reviews");

const sectionTitles = [
  "Learning Goal",
  "Core Grammar",
  "Examples",
  "Jason's Confusing Points",
  "Wrong Answers",
  "One-line Summary"
];

export function getProgress(): UnitProgress[] {
  const progressByUnit = new Map(
    (progressData as ProgressData).units.map((unit) => [unit.unit, unit])
  );

  return getUnits().map((unit) => {
    const progress = progressByUnit.get(unit.unit);
    return {
      ...unit,
      status: progress?.status ?? "not_started",
      mastery: progress?.mastery ?? 0,
      weaknesses: progress?.weaknesses ?? []
    };
  });
}

export function getUnits(): UnitMetadata[] {
  return (unitsData as UnitsData).units;
}

export function getContentStatus(): ContentStatusRecord[] {
  return (contentStatusData as ContentStatusData).units;
}

export function getContentLevelDescriptions() {
  return (contentStatusData as ContentStatusData).levels;
}

export function getActiveStudyUnits(): UnitProgress[] {
  return getProgress().filter(
    (unit) =>
      unit.priority === "active" ||
      unit.status === "completed" ||
      unit.status === "in_progress" ||
      unit.status === "next"
  );
}

export function getWrongAnswers(): WrongAnswer[] {
  return wrongAnswersData.items as WrongAnswer[];
}

export function getQuizQuestions(): QuizQuestion[] {
  return (quizQuestionsData as QuizQuestionsData).questions;
}

export function getQuizQuestionsByUnit(unit: number): QuizQuestion[] {
  return getQuizQuestions().filter((question) => question.unit === unit);
}

export function getPracticeCoverage(): UnitPracticeSummary[] {
  const counts = new Map<number, number>();

  for (const question of getQuizQuestions()) {
    counts.set(question.unit, (counts.get(question.unit) ?? 0) + 1);
  }

  return getUnits().map((unit) => ({
    unit: unit.unit,
    questionCount: counts.get(unit.unit) ?? 0
  }));
}

export function getUnitConfusingPatterns(unit: UnitMetadata): string[] {
  if (unit.part === "Present and past") {
    return [
      "Time signal vs verb form: do not choose tense by Chinese translation only.",
      "Simple form vs continuous form: habit/fact is different from action in progress.",
      "Present perfect vs past simple: connected-to-now is different from finished past time."
    ];
  }

  if (unit.part === "Future") {
    return [
      "Future meaning does not always use will.",
      "Plans, predictions, promises, and time clauses use different structures.",
      "After when/after/before/as soon as for future time, use present form."
    ];
  }

  if (unit.part === "Modals") {
    return [
      "Modal + base verb: do not add to after should/can/must/might.",
      "Modal + have + past participle talks about past regret or past deduction.",
      "mustn't means prohibited, but don't have to means not necessary."
    ];
  }

  if (unit.part === "Conditionals and wish") {
    return [
      "Real condition, unreal present, and unreal past use different timelines.",
      "wish + past is about an unreal present; wish + past perfect is about past regret.",
      "would in the result clause is not the same as will in a real condition."
    ];
  }

  if (unit.part === "Passive") {
    return [
      "Find the receiver of the action before choosing active or passive.",
      "Passive form is be + past participle; modal passive is modal + be + past participle.",
      "been done and being done are easy to mix because one is perfect and one is continuous."
    ];
  }

  if (unit.part === "Prepositions" || unit.part === "Phrasal verbs") {
    return [
      "Many answers depend on collocation, not direct Chinese translation.",
      "Check whether the word after the preposition is a noun phrase or -ing form.",
      "Phrasal verbs often change meaning when the particle changes."
    ];
  }

  return [
    "Identify the sentence job first: verb pattern, noun phrase, clause, modifier, or connector.",
    "Compare the answer choices by structure before choosing by meaning.",
    "Watch for natural English collocations that do not translate word by word."
  ];
}

export function getWrongAnswersByCategory() {
  return getWrongAnswers().reduce<Record<WrongAnswerCategory, WrongAnswer[]>>(
    (groups, item) => {
      groups[item.category].push(item);
      return groups;
    },
    {
      Wish: [],
      Conditionals: [],
      Passive: [],
      "Modal Verbs": []
    }
  );
}

export function getWeaknessRanking() {
  const counts = new Map<string, { label: string; count: number; units: number[] }>();

  for (const unit of getProgress()) {
    for (const weakness of unit.weaknesses) {
      const current = counts.get(weakness) ?? {
        label: weakness,
        count: 0,
        units: []
      };
      current.count += 1;
      current.units.push(unit.unit);
      counts.set(weakness, current);
    }
  }

  for (const wrong of getWrongAnswers()) {
    const key = wrong.category;
    const current = counts.get(key) ?? {
      label: key,
      count: 0,
      units: []
    };
    current.count += wrong.severity;
    if (!current.units.includes(wrong.unit)) {
      current.units.push(wrong.unit);
    }
    counts.set(key, current);
  }

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function getUnitSlugs() {
  return getUnits().map((unit) => unit.slug);
}

export function getUnitContent(slug: string): UnitContent {
  const metadata = getUnits().find((unit) => unit.slug === slug);

  if (!metadata) {
    throw new Error(`Unknown unit slug: ${slug}`);
  }

  const filePath = path.join(unitsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return getPlaceholderUnitContent(metadata);
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { frontmatter, markdown } = parseFrontmatter(source);
  const sections = parseSections(markdown);

  return {
    unit: Number(frontmatter.unit),
    slug,
    title: String(frontmatter.title),
    sections
  };
}

export function getAllUnitContent() {
  return getUnitSlugs().map(getUnitContent);
}

export function getReviewRecords(): ReviewRecord[] {
  return fs
    .readdirSync(reviewsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const source = fs.readFileSync(path.join(reviewsDir, file), "utf8");
      return JSON.parse(source) as ReviewRecord;
    })
    .sort((a, b) => a.unit - b.unit);
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, markdown: source };
  }

  const frontmatter = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const [key, ...value] = line.split(":");
      return [key.trim(), value.join(":").trim()];
    })
  );

  return {
    frontmatter,
    markdown: match[2].trim()
  };
}

function parseSections(markdown: string) {
  const sections = markdown.split(/^## /m).filter(Boolean);

  return sections.map((section) => {
    const [rawTitle, ...body] = section.split("\n");
    return {
      title: rawTitle.trim(),
      body: body.join("\n").trim()
    };
  });
}

export function getMissingSections(unit: UnitContent) {
  const existing = new Set(unit.sections.map((section) => section.title));
  return sectionTitles.filter((title) => !existing.has(title));
}

function getPlaceholderUnitContent(metadata: UnitMetadata): UnitContent {
  return {
    unit: metadata.unit,
    slug: metadata.slug,
    title: metadata.title,
    sections: [
      {
        title: "Learning Goal",
        body: "Placeholder. Add Jason's learning goal after this unit becomes active."
      },
      {
        title: "Core Grammar",
        body: "Placeholder. Summarize the core grammar in Jason's own words."
      },
      {
        title: "Examples",
        body: "Placeholder. Add short examples from Jason's practice, not copied textbook passages."
      },
      {
        title: "Jason's Confusing Points",
        body: "Placeholder. Save confusing points from ChatGPT sessions here."
      },
      {
        title: "Wrong Answers",
        body: "Placeholder. Link or summarize wrong answers related to this unit."
      },
      {
        title: "One-line Summary",
        body: "Placeholder. Add a one-line memory hook after review."
      }
    ]
  };
}
