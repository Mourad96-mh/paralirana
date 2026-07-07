# Topical Authority Prompt — No-SEMrush Edition

> Paste this whole prompt into Claude Code from the project root, after you've put your
> data files in `research/`. It replaces the SEMrush step with free data.

---

## SYSTEM ROLE

You are a Senior Technical SEO Architect building topical authority for a brand new
website from scratch.

## STEP 1 — READ THE PROJECT CONTEXT

Read the `CLAUDE.md` file in this project. Extract: what the website is about
(topic/niche), the target audience, the business model (how it makes money), and the
location and language. Use this as your foundation. Do not ask me for any of this — it
is in CLAUDE.md.

## STEP 2 — LOAD MARKET RESEARCH FROM /research/

I do NOT have SEMrush. Read the data files in the `research/` folder instead:

- `search-console-queries.csv` — real queries the site already gets impressions for
- `keyword-planner.csv` — keyword ideas with volume ranges (set to the target market)
- `autocomplete.txt` — Google autocomplete and "People Also Ask" suggestions
- `competitors.txt` — competitor URLs I listed manually

From this data:
1. Cluster all keywords into topic groups by meaning.
2. Tag intent for each: informational / commercial / transactional.
3. Estimate difficulty qualitatively (long-tail specific = easier; short broad = harder).
   You cannot pull exact difficulty scores — flag this as an estimate.
4. Identify the best entry points — low-competition, specific, long-tail terms a brand
   new site can realistically rank for first.

If a research file is missing or thin, tell me which one and proceed with what's
available rather than stopping. Handle all keywords and content in the project's primary
language (per CLAUDE.md).

## STEP 3 — MARKET SUMMARY

Write a short summary: size of the opportunity, main keyword clusters, content types
likely to win, and the best entry points for a brand new site. Where SEMrush would have
given competitor dominance data, infer it from the competitor URLs and note it's an estimate.

## STEP 4 — SITEMAP

Build the full topical authority sitemap. Structure: pillar → cluster → long-tail.

### A) HUMAN OUTLINE
For each page: primary keyword + 3–5 secondary keywords; search intent; page type
(Guide / Comparison / Blog / Feature / Template); URL slug (3–5 words, hyphenated,
lowercase); title tag (≤60 chars), meta description (≤155 chars), H1; schema type;
content brief (3–5 bullets); CTA / conversion element; breadcrumb path.

Format:
```
[Homepage: /]
  ├─ [Pillar: /{silo}/]
  │   ├─ [Support: /{silo}/{page}/]
  │   └─ [Support: /{silo}/{page}/]
  └─ [Pillar: /{silo}/]
```

### B) INTERNAL LINK PLAN
Table: | FROM | TO | Anchor 1 | Anchor 2 | Anchor 3 | Rationale |
Rules: Pillar → all supports (3 anchor variants each); Support → pillar (1 anchor);
Support ↔ support (2–4 lateral links per page); cross-silo links only where topics
genuinely intersect.

### C) CANNIBALIZATION CHECK
Flag overlapping keyword targets. Give a resolution for each (merge / retarget /
redirect). Produce a clean query-to-URL map (1 URL per core query).

### D) DEV-HANDOFF JSON
```json
{
  "url": "/{slug}/",
  "title": "...",
  "h1": "...",
  "intent": "informational|commercial|transactional|navigational",
  "primary_keyword": "...",
  "secondary_keywords": ["..."],
  "schema": "...",
  "parent": "/{parent}/",
  "breadcrumb": ["/", "/{silo}/", "/{slug}/"],
  "pillar": true,
  "money_page": true,
  "anchors_out": [
    {"to": "/{target}/", "variants": ["...", "...", "..."], "rationale": "..."}
  ],
  "canonical": "self",
  "notes": "content brief + CTA"
}
```

### E) PRIORITY PUBLISH WAVES
- Wave 1: Pillar pages + lowest difficulty, highest volume support pages
- Wave 2: Commercial intent — comparisons, alternatives, pricing
- Wave 3: Long-tail, niche use cases

## STEP 5 — QUALITY CHECK

Score 1–10 on each; refine and re-output any section below 9: topical coverage per silo,
intent balance, cannibalization risk (inverted), internal link robustness, crawl depth
(money pages ≤ 3 clicks), business alignment.

## STEP 6 — 90-DAY ROADMAP

- Weeks 1–4: Publish Wave 1, set up internal links
- Weeks 5–8: Publish Wave 2, monitor impressions by cluster
- Weeks 9–12: Publish Wave 3, refresh underperformers

Measurement: impressions and clicks per silo weekly, pages entering top 20, internal
link flow to money pages.

**START NOW. Read CLAUDE.md first, then load research from /research/, then produce all steps.**
