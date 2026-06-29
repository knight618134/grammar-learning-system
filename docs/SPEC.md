# Product Spec

## Product Vision

Grammar in Use Learning System is a personal English grammar learning platform that helps Jason study, review, and eventually master the full Grammar in Use path. The system should start simple and local-first, then grow into an AI-assisted learning companion for grammar, wrong-answer review, and work English.

## Target User

The first user is Jason, an English learner who wants a structured, reviewable system for grammar units, confusing points, wrong answers, and test history.

The product should optimize for long-term study rather than one-time reading.

## MVP Scope

The MVP covers Units 33-43.

Core features:

- Dashboard showing unit progress
- Unit pages backed by content files
- Wrong-answer review grouped by category
- Review test records and accuracy
- Local data storage with no account system

## Unit Content Requirements

Every unit must include these sections:

- Learning Goal
- Core Grammar
- Examples
- Jason's Confusing Points
- Wrong Answers
- One-line Summary

## Progress States

Units can be:

- `completed`
- `in_progress`
- `next`

For the initial seed:

- Unit 42 is `completed`
- Unit 43 is `in_progress`

## Wrong Answer Categories

The first supported categories are:

- Wish
- Conditionals
- Passive
- Modal Verbs

## Non-Goals For MVP

- Login or cloud sync
- Admin CMS
- Database server
- AI Tutor chat
- Spaced repetition scheduling
- Full Unit 1-145 coverage

These are planned later, but the MVP should not become complex before the learning loop is proven.

## Success Criteria

- Jason can open the site locally and continue Unit 43.
- Unit content can be edited without changing React pages.
- Weak points and wrong answers are visible from the Dashboard.
- The structure can scale from Units 33-43 to the full book.
