# Technical SEO Setup Prompt

> Run this from inside `codebase/` in Claude Code once the project exists. **Stack-aware** —
> use the column for your chosen stack (see CLAUDE.md). All approaches must produce crawlable
> static HTML per route; never a client-only SPA.

Set up technical SEO foundations from scratch, properly, from day one. For each item below,
use the convention for your stack:

| # | Foundation | React + Vite SSG (default) | Next.js (App Router) |
|---|------------|----------------------------|----------------------|
| 1 | **Sitemap** (auto-includes new pages) | build-time script that scans the prerendered `dist/` and writes `public/sitemap.xml` with `<lastmod>`, wired as npm `prebuild` | dynamic `sitemap.ts` |
| 2 | **Robots.txt** (allow all + sitemap URL) | static `public/robots.txt` | `robots.ts` |
| 3 | **Metadata** (title template, description, OG, locale) + unique per page | a shared `<Seo>` head component via `vite-react-ssg`'s `<Head>` | global template in root `layout.tsx` |
| 4 | **Canonical URLs** self-referencing on every page | inside the `<Seo>` component | in the metadata template |
| 5 | **Schema** — Organization/LocalBusiness on layout; page schema on key pages | JSON-LD components rendered via `<Head>` | JSON-LD in layout/page |

Make it dynamic/automatic where possible so it scales as the site grows. Set the default
locale to the project's primary language (see CLAUDE.md). Show me what you created and where
each file lives.

> **For React + Vite SSG**, the companion **`seo-audit` skill** already ships battle-tested
> scripts for items 1–5 (`generate-sitemap.mjs`, schema components, `validate-schema.mjs`,
> `make-og-image.mjs`) plus a full audit playbook — prefer those over writing from scratch.
