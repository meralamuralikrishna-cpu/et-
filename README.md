# AP ECET Tracker (2026)

Syllabus progress tracker for **AP ECET 2026** — Diploma Holders in Engineering (**CSE**).

Covers the official common + branch papers:

| Paper | Marks |
| --- | ---: |
| Mathematics | 50 |
| Physics | 25 |
| Chemistry | 25 |
| Computer Science & Engineering | 100 |
| **Total** | **200** |

## Features

- Unit-wise topics with exam question weightage
- Expandable checklist for each topic’s syllabus points
- Status cycle: **To do → Learning → Done → Revised**
- Weighted readiness % (marks × status)
- Search + subject filters
- Progress and study history saved to `data.json` while running locally
- Links to official APSCHE PDFs

## Run

```bash
npm install
npm run dev
```

The Vite development server reads and writes tracker data in the project-root
`data.json` file. Keep that file to retain your progress.

## Stack

Vite + React 19
