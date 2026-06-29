# Data Model

## Progress

File: `data/progress.json`

```ts
type UnitStatus = "completed" | "in_progress" | "next";

type UnitProgress = {
  unit: number;
  title: string;
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

Separate stable unit metadata from user progress:

```text
data/units.json
data/progress.json
```

This will make it easier to support multiple learners or reset progress without touching unit titles.

## Unit Content

Files: `content/units/unit-33.mdx` through `content/units/unit-43.mdx`

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
