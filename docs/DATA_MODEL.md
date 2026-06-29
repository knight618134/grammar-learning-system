# Data Model

## Unit Metadata

File: `data/units.json`

```ts
type UnitMetadata = {
  unit: number;
  title: string;
  slug: string;
  part: string;
  priority: "foundation" | "active" | "future";
};
```

Current purpose:

- Stores the full Unit 1-145 textbook skeleton.
- Separates stable textbook metadata from Jason's personal progress.
- Allows placeholder pages to exist before full notes are written.

## Progress

File: `data/progress.json`

```ts
type UnitStatus = "completed" | "in_progress" | "next";

type UnitProgressState = {
  unit: number;
  status: UnitStatus;
  mastery: number;
  weaknesses: string[];
};
```

Current purpose:

- Drives Dashboard unit cards
- Drives Unit navigation status
- Contributes to weakness ranking

Future consideration:

Progress stores Jason's learning state only. Titles and textbook grouping live in `data/units.json`.

## Unit Content

Files: `content/units/*.mdx`

Each file includes frontmatter:

```yaml
---
unit: 43
title: It is said that / He is said to
---
```

Required sections:

- Learning Goal
- Core Grammar
- Examples
- Jason's Confusing Points
- Wrong Answers
- One-line Summary

Units 1-32 currently have placeholder files. Units 33-43 contain active learning notes aligned to the textbook outline. Units without a file can still render a generated placeholder page from `data/units.json`.

## Learning Notes

Folder: `content/learning-notes`

Purpose:

- Save Jason-specific learning memory from ChatGPT sessions.
- Keep confusing points and useful explanations outside the temporary context window.
- Act as an inbox before notes are sorted into unit files, wrong answers, or reviews.

## Wrong Answers

File: `data/wrong-answers.json`

```ts
type WrongAnswer = {
  id: string;
  category: "Wish" | "Conditionals" | "Passive" | "Modal Verbs";
  unit: number;
  prompt: string;
  wrongAnswer: string;
  correctAnswer: string;
  note: string;
  severity: number;
};
```

Current purpose:

- Drives `/wrong-answers`
- Contributes category weights to the Dashboard weakness ranking

Future fields:

- `status`
- `lastReviewedAt`
- `reviewCount`
- `source`
- `tags`

## Review Records

Files: `content/reviews/unit-42.json`, `content/reviews/unit-43.json`

```ts
type ReviewRecord = {
  unit: number;
  title: string;
  date: string;
  score: number;
  total: number;
  focus: string[];
  notes: string;
};
```

Current purpose:

- Drives `/reviews`
- Shows Dashboard review snapshot

Future fields:

- `durationMinutes`
- `questionIds`
- `wrongAnswerIds`
- `nextReviewAt`
