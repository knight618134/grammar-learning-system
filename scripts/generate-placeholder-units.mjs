import fs from "node:fs";
import path from "node:path";
import unitsData from "../data/units.json" with { type: "json" };

const [range = "1-32"] = process.argv.slice(2);
const [start, end] = range.split("-").map(Number);

if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
  throw new Error("Usage: npm run content:placeholders -- 1-32");
}

const unitsDir = path.join(process.cwd(), "content", "units");
fs.mkdirSync(unitsDir, { recursive: true });

for (const unit of unitsData.units) {
  if (unit.unit < start || unit.unit > end) {
    continue;
  }

  const filePath = path.join(unitsDir, `${unit.slug}.mdx`);

  if (fs.existsSync(filePath)) {
    continue;
  }

  const body = [
    "---",
    `unit: ${unit.unit}`,
    `title: ${unit.title}`,
    "---",
    "",
    "## Learning Goal",
    "Placeholder. Add Jason's learning goal when this foundation unit becomes active.",
    "",
    "## Core Grammar",
    "Placeholder. Summarize the core grammar in Jason's own words.",
    "",
    "## Examples",
    "Placeholder. Add short examples from Jason's practice, not copied textbook passages.",
    "",
    "## Jason's Confusing Points",
    "Placeholder. Save confusing points from ChatGPT sessions here.",
    "",
    "## Wrong Answers",
    "Placeholder. Link or summarize wrong answers related to this unit.",
    "",
    "## One-line Summary",
    "Placeholder. Add a one-line memory hook after review.",
    ""
  ].join("\n");

  fs.writeFileSync(filePath, body);
}
