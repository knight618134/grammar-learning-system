import fs from "node:fs";
import path from "node:path";
import unitsData from "../data/units.json" with { type: "json" };

const requiredSections = [
  "Learning Goal",
  "Core Grammar",
  "Examples",
  "Jason's Confusing Points",
  "Wrong Answers",
  "One-line Summary"
];

const unitsDir = path.join(process.cwd(), "content", "units");
const errors = [];

for (const unit of unitsData.units) {
  const filePath = path.join(unitsDir, `${unit.slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, "utf8");

  for (const section of requiredSections) {
    if (!source.includes(`## ${section}`)) {
      errors.push(`${unit.slug}: missing "${section}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${unitsData.units.length} unit metadata records.`);
