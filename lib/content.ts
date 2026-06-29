import fs from "node:fs";
import path from "node:path";
import progressData from "@/data/progress.json";
import wrongAnswersData from "@/data/wrong-answers.json";
import type {
  ProgressData,
  ReviewRecord,
  UnitContent,
  UnitProgress,
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
  return (progressData as ProgressData).units;
}

export function getWrongAnswers(): WrongAnswer[] {
  return wrongAnswersData.items as WrongAnswer[];
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
  return getProgress().map((unit) => `unit-${unit.unit}`);
}

export function getUnitContent(slug: string): UnitContent {
  const filePath = path.join(unitsDir, `${slug}.mdx`);
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
