# Grammar in Use Learning System

A local-first learning system for studying English Grammar in Use. The current MVP tracks Units 33-43, stores grammar notes as MDX files, and keeps progress, review records, and wrong answers in local JSON data.

## Current MVP

- Dashboard for Units 33-43 progress
- Unit pages from `/units/unit-33` to `/units/unit-43`
- MDX-based unit content with fixed learning sections
- Wrong answers grouped by grammar category
- Review test records for Units 42 and 43
- Local-first data model with no login requirement

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Markdown/MDX-style content files
- JSON progress and review data

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
app/                  App Router pages
components/           Shared UI components
content/units/        Unit learning content
content/reviews/      Review test records
data/                 Local progress and wrong-answer JSON
lib/                  Data loading and shared types
docs/                 Product and engineering documentation
```

## Documentation

- [Product Spec](docs/SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Tasks](docs/TASKS.md)
- [Data Model](docs/DATA_MODEL.md)
- [UI Guidelines](docs/UI_GUIDELINES.md)
- [Changelog](docs/CHANGELOG.md)
