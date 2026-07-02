# UI Guidelines

## Product Feel

The app should feel like a focused learning workspace, not a marketing site. Prioritize clarity, scanability, and repeated daily use.

## Layout Principles

- Keep the Dashboard dense but calm.
- Make Unit pages readable for long-form study.
- Keep navigation predictable.
- Avoid decorative elements that do not support learning.
- Use cards for repeated items, not for every section of the page.

## Color Usage

Current palette:

- `leaf` for success and primary action
- `gold` for in-progress state
- `sky` for review and neutral emphasis
- `coral` for errors and weak points
- `mist` for quiet surfaces
- `ink` for text

Use color to communicate status, not just decoration.

## Typography

- Page titles should be clear and direct.
- Compact panels should use smaller headings.
- Avoid oversized hero-style type inside dashboards and cards.
- Keep body text comfortable for reading grammar explanations.

## Components

Shared components should represent real product concepts:

- Status badge
- Unit navigation
- Wrong answer card
- Review card
- Progress meter
- Unit section

Avoid extracting components only because JSX is long; extract when a concept repeats.

## Unit Page Requirements

Each Unit page should make these sections visually easy to scan:

- Learning Goal
- Core Grammar
- Examples
- Jason's Confusing Points
- Wrong Answers
- One-line Summary

The page should support real study notes, not only short seed paragraphs.

## Bilingual Learning Format

Jason's active units should use bilingual notes, especially for difficult grammar.

Recommended format inside `Core Grammar`:

- `### A. ... / 中文標題`
- English explanation
- Chinese explanation
- short examples

This mirrors the textbook's A/B/C/D teaching rhythm without copying textbook text. The explanations should be original and written for Jason's confusion points.

Active units should include:

- English rule
- Chinese explanation
- simple examples
- Jason-specific warning
- wrong-answer correction

For Units 1-43, every unit should have at least A/B/C/D grammar explanation subsections in `Core Grammar`.

## Dashboard Requirements

The Dashboard should answer:

- What should Jason continue next?
- Which units are completed or in progress?
- What are the current weak points?
- How did recent reviews go?

## Grammar Map Requirements

The Grammar Map should help Jason understand the whole textbook structure at a glance:

- Group units by grammar family, such as tenses, modals, conditionals, passive, nouns, clauses, prepositions, and phrasal verbs.
- Show unit ranges, content level, study status, and whether the unit is foundation, active, or future.
- Keep the map scannable on mobile; dense lists are acceptable when the labels are short and stable.

## Practice Answer Breakdown

Practice explanations should make the answer logic visible:

- `Clue` uses sky for the words or context that reveal the grammar point.
- `Structure` uses gold for the sentence pattern.
- `Answer` uses leaf for why the correct choice works.
- `Trap` uses coral for the common wrong turn Jason might take.

## Accessibility

- Links and buttons should have visible text.
- Status should not rely only on color.
- Text must fit on small screens.
- Cards should remain readable on mobile.
