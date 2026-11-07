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
- Progress saved in `localStorage`
- Links to official APSCHE PDFs

## Run

```bash
npm install
npm run dev
```

## Deploy to Vercel

Import this repository into Vercel. It will detect the Vite app automatically;
use `npm run build` as the build command and `dist` as the output directory.
The included `vercel.json` sends app routes such as `/colleges` to the SPA entry
point, so direct links and page refreshes work on the deployed `.vercel.app`
domain.

## Stack

Vite + React 19
