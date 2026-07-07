# CLAUDE.md — Project Brain (Para Lirana)

> **Brand:** the site is branded **Para Lirana** (green + gold botanical logo).
> _(Formerly "Para d'Or" — renamed 2026-07-03.)_

This file is the single source of truth for this project. Read it before doing anything.

## What this website is

Para Lirana is an online **parapharmacy** for Morocco — it sells health, beauty, hair,
baby and supplement products (La Roche-Posay, Avène, Bioderma, CeraVe, Eucerin, Vichy,
Mustela, etc.) at discount prices. It exists to let customers across Moroccan cities
browse a curated catalog and order easily, without needing a physical pharmacy visit.

## The business model

Customers browse the catalog and **place orders via WhatsApp / phone** (no online card
payment in v1). The site makes money by turning organic search + social traffic into
WhatsApp orders.

The **money pages** (the pages that directly drive revenue) are:
- Category pages (e.g. /visage, /capillaire, /complements-alimentaires)
- Product detail pages (the "Commander sur WhatsApp" action)
- The cart page (collects name/phone/city, saves the order to the DB, then opens a
  pre-filled WhatsApp message)

Blog and guide content exists to bring traffic and funnel it toward those pages.

## Target audience

Moroccan consumers (women 20–45 are the core) shopping for skincare, hair, baby and
supplement products. They compare against cotepara.ma, parashop.ma and pharmacy prices.
The angle that wins: trusted authentic brands, discount prices, fast WhatsApp ordering,
delivery across Morocco.

## Location and language

- **Primary market:** Morocco
- **Primary content language:** French (fr-FR)
- **Secondary market (later, optional):** Arabic (ar-MA, RTL)

## Stack

> **Architecture = SPLIT** (headless, like the algopharma project), decided 2026-07-07.
> Frontend and backend deploy separately. See `DEPLOYMENT.md`.

- **Frontend:** **Next.js 14 (App Router) + TypeScript**, built as a **static export**
  (`output: 'export'`, `trailingSlash: true`) → `codebase/out/`, hosted on **Hostinger**.
  Crawlable HTML per route (SEO). The catalog is baked at build from a snapshot
  (`codebase/lib/catalog.data.json`, written by `scripts/sync-content.mjs` fetching the API)
  and can refresh live from the API in the browser. Not a client-only SPA.
- **Backend:** a standalone **Express API** in **`codebase/server/`** (plain ESM JS,
  Mongoose + Cloudinary + JWT bearer auth), hosted on **Render** (`render.yaml`, `paralirana-api`).
- Styling: **Tailwind CSS**
- Database: **MongoDB Atlas** (Mongoose) — catalog + orders. Accessed only by the server.
- Admin dashboard: custom **`/admin`** (static pages) that call the Express API with a
  **JWT bearer token in localStorage**; auth guard is client-side (no middleware in export).
  Lets the non-technical client manage products + orders in the browser.
- Ordering: **cart → `POST {API}/api/orders` (prices recomputed server-side), then pre-filled
  WhatsApp message**. Orders persisted (customer + items + status). No online card payment.
- Product images: **Cloudinary** upload via `POST {API}/api/uploads` (or a pasted URL).
- Deployment: **Hostinger (static frontend) + Render (Express API)** — see `DEPLOYMENT.md`.

### Data & admin

- Shared types + static category list: `codebase/lib/products.ts` (client-safe).
- Build-time catalog access: `codebase/lib/data/products.ts` reads `lib/catalog.data.json`
  (no DB — client-safe). Admin HTTP client: `codebase/lib/adminApi.ts`.
- **Server** (`codebase/server/`): models `src/models/{Product,Order,Admin}.js`; routes
  `src/routes/{auth,products,orders,uploads}.js`; public `GET /api/products`, `POST /api/orders`;
  protected (bearer) writes + `GET /api/orders`. `npm run seed` seeds catalog + admin.
- Storefront under `app/(site)/`; admin under `app/admin/` (noindex).
- **Frontend setup:** `codebase/.env.local` from `.env.example` (`NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_API_URL`, `CONTENT_API_URL`).
  **Server setup:** `codebase/server/.env` from `.env.example` (`MONGODB_URI`, `JWT_SECRET`,
  `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `CLOUDINARY_*`, `CORS_ORIGIN`).
- Static export has **no API routes / middleware / ISR** — that logic now lives in the server.
- **Don't wipe `.next` or run `npm run build` while a `next dev` server is running** — it
  corrupts the dev route manifest.

## Project structure

```
paralirana-seo-site/
├── codebase/        ← the Next.js site
│   ├── app/(site)/  ← public storefront (ISR)
│   ├── app/admin/   ← custom admin dashboard (products + orders)
│   ├── app/api/     ← route handlers (public orders + protected admin API)
│   ├── lib/ models/ ← data access, Mongoose models, auth
│   └── scripts/     ← `npm run seed`
├── research/        ← keyword data, topical map (NO SEMrush)
├── content/         ← brand voice, drafts, published, images
└── CLAUDE.md        ← this file
```

## Catalog taxonomy (from market research)

Main categories: Visage, Corps, Capillaire, Solaire, Maquillage, Bébé & Maman,
Compléments Alimentaires, Hygiène, Parfum, Minceur.

## Standing rules

- Client-facing content in **French**, natural and idiomatic.
- Do NOT copy competitor photos or product descriptions. Use placeholders + own copy.
- Prices in **MAD (Dirham)**.
- Every page: unique title + meta description, self-referencing canonical.
