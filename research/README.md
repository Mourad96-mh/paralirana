# research/ — Keyword data and topical map

This folder holds all market research. **We do not use SEMrush.** We use free data
sources instead. Claude reads the files here to build the topical map and keyword briefs.

## Files to put here

### `search-console-queries.csv`
Export from Google Search Console (Performance → Queries → Export). The most valuable
file — the exact queries people already use to find the site, with impressions, clicks,
and average position. (Empty for a brand-new domain with no traffic yet — that's fine.)
Columns: `query, clicks, impressions, ctr, position`

### `keyword-planner.csv`
Export from Google Keyword Planner (free with a Google Ads account). **Set the location
and language to the project's target market** (see CLAUDE.md) before generating ideas.
Columns: `keyword, avg_monthly_searches, competition, top_of_page_bid_low, top_of_page_bid_high`

### `autocomplete.txt`
Paste Google autocomplete suggestions and "People Also Ask" questions. Type your main
keywords into Google and collect the suggestions. One per line.

### `competitors.txt`
Competitor URLs, one per line. Without SEMrush we judge competition by eyeballing who
ranks on page one for the target queries.

## How Claude uses this

The topical authority prompt (`topical-authority-prompt.md`) reads these files, clusters
keywords by meaning, tags intent (informational / commercial / transactional), estimates
difficulty qualitatively, and builds the sitemap and content briefs in the project's
primary language.

## Difficulty note

Without SEMrush we cannot pull exact keyword difficulty scores. Difficulty is estimated
from query shape and from who currently ranks. Treat difficulty labels as estimates.
