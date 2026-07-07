# START HERE — SEO Site Standard

This is your reusable standard for building SEO sites. Clone this folder for every new
project, fill in the placeholders, and follow the steps below. Same process every time.

---

## The standard (what this enforces)

1. **Stack:** the site MUST ship **crawlable static HTML per route** (SSG/prerendered).
   First-class, validated choice: **React + Vite SSG** (`vite-react-ssg`, prerendered) —
   this is the team's proven stack (scored SEO 100 / Perf 99 in production). **Next.js
   (App Router)** and **Astro** are equally acceptable. Avoid only **client-only React
   SPAs (CSR)** — an empty `<div id="root">` that fills in via JS is the weakest choice
   for SEO. A prerendered React+Vite build is NOT a SPA in that sense; it emits full HTML.
2. **No SEMrush required.** Keyword data comes from free sources: Google Search Console,
   Google Keyword Planner, and autocomplete. (If you ever do have SEMrush, the workflow
   still works — just richer data.)
3. **Context before content.** Claude always reads `CLAUDE.md` and everything in
   `content/context/` before writing a single word.
4. **Drafts first.** Content goes to `drafts/`, gets reviewed, then moves to `published/`.
5. **Technical SEO from day one** — sitemap, robots, metadata, canonicals, schema.
6. **Indexing ≠ backlinks.** Pages index via sitemap + Search Console. Links help
   ranking, not indexing. Don't block progress on link count.

---

## Setup steps for a NEW project

### 1. Clone and rename
Copy this whole `seo-site-template/` folder and rename it to your project
(e.g. `clientname-seo-site/`).

### 2. Fill in CLAUDE.md
Open `CLAUDE.md` and replace every `{{PLACEHOLDER}}`. This is the most important file —
it defines the niche, audience, business model, location, and language. Everything else
keys off it. Don't skip any placeholder.

### 3. Fill in the content context
- `content/context/brand-voice.md` — replace placeholders with this project's voice.
- `content/context/style-guide.md` — usually keep as-is; adjust word counts / banned
  words per project if needed.
- `content/context/writing-examples.md` — paste 3 real best-in-class writing samples.
- `content/context/transcripts/` — drop in any voice notes / video transcripts.

### 4. Build the site
Pick the stack (all emit crawlable static HTML — see the standard above):
```
cd codebase
# React + Vite SSG (default, team-validated):
npm create vite@latest . -- --template react   # then add vite-react-ssg for prerendering
# — or — Next.js (App Router):
npx create-next-app@latest .
```
Then in Claude Code, run the prompt in `codebase/technical-seo-prompt.md` (it's stack-aware).

### 5. Gather keyword research (free, no SEMrush)
Fill the files in `research/` (see `research/README.md` for exactly what each one is):
- `search-console-queries.csv` — export from Google Search Console (best source)
- `keyword-planner.csv` — export from Google Keyword Planner (set target country + language)
- `autocomplete.txt` — paste Google autocomplete + "People Also Ask"
- `competitors.txt` — list competitor URLs

### 6. Build the topical map
From the project root in Claude Code, paste the prompt in
`research/topical-authority-prompt.md`. It reads CLAUDE.md + research/, then produces the
sitemap, internal link plan, and publish waves.

### 7. Write content
Tell Claude Code to write articles from the topical map. It reads `content/context/`
first, writes to `content/drafts/`. Review, then move approved pieces to `content/published/`.

### 8. Technical + launch checklist
- [ ] sitemap.xml live and submitted in Search Console
- [ ] robots.txt allows crawling + points to sitemap
- [ ] every page has unique title + meta description
- [ ] canonical tags self-referencing
- [ ] Organisation/LocalBusiness schema on layout, page schema on key pages
- [ ] correct locale set (e.g. fr-FR, en-US)
- [ ] property verified in Google Search Console

---

## Optional automation (once the workflow is trusted)
- **Scheduled tasks** (Claude desktop app): weekly keyword pulls, monthly performance checks.
- **Hooks:** run an SEO check automatically whenever a new draft lands in `content/drafts/`.
- **Loops:** `/loop` to write through a whole keyword list one article at a time.

---

## Folder map
```
<project>-seo-site/
├── codebase/        ← the site (React+Vite SSG / Next.js / Astro) + technical-seo-prompt.md
├── research/        ← keyword data, topical map, the topical-authority-prompt
├── content/         ← context, drafts, published, images
├── CLAUDE.md        ← the brain (fill placeholders first)
└── START-HERE.md    ← this file
```
