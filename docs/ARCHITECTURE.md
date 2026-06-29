# Architecture

## Overview

The app is a local-first Next.js App Router project. Pages read content and progress data from local files at build/runtime. This keeps the first version simple, portable, and easy to inspect in Git.

```text
Browser
  |
  v
Next.js App Router pages
  |
  v
lib/content.ts
  |
  +-- content/units/*.mdx
  +-- content/reviews/*.json
  +-- data/progress.json
  +-- data/wrong-answers.json
```

## App Router

Routes:

- `/` Dashboard
- `/units` redirects to `/units/unit-33`
- `/units/[slug]` Unit detail pages
- `/wrong-answers` Wrong-answer review
- `/reviews` Review test history

## Data Loading

`lib/content.ts` is the data access boundary. Pages should avoid reading files directly. This keeps future migration to a database, CMS, or sync layer easier.

Current loaders:

- `getProgress()`
- `getWrongAnswers()`
- `getWrongAnswersByCategory()`
- `getWeaknessRanking()`
- `getUnitContent(slug)`
- `getReviewRecords()`

## Content Strategy

Unit files live in `content/units`. They use MDX-style markdown with frontmatter and fixed sections. The current renderer supports a small markdown subset through `MarkdownBlock`.

This is enough for seed content, but future versions may use a full MDX pipeline when embedded components or richer formatting are needed.

## Component Strategy

Current shared components:

- `StatusBadge`
- `UnitNav`
- `MarkdownBlock`

As the product grows, new components should be extracted around stable learning concepts, not around one-off page layout pieces.

Good future component candidates:

- `ProgressMeter`
- `WeaknessRanking`
- `WrongAnswerCard`
- `ReviewAccuracyCard`
- `UnitSection`

## Scaling To Unit 145

The current file-per-unit approach can scale to the full book if:

- Unit metadata stays normalized in JSON or a typed manifest.
- Unit content remains outside page components.
- Search and filtering are added before the unit list becomes too long.
- Content validation is introduced to catch missing required sections.

## Future AI Layer

AI Tutor and RAG should be added behind clear boundaries:

- Content source: unit notes, wrong answers, review records
- Retrieval layer: indexes local content
- Tutor layer: prompt and response workflow
- UI layer: chat/review interface

The AI layer should not be coupled directly to page components.
