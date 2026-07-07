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

- Framework: **Next.js 14 (App Router) + TypeScript** — outputs crawlable HTML per route.
  Public pages are statically rendered with **ISR** (`revalidate` + on-demand
  `revalidatePath` when admin edits), so they stay SSG/SEO-friendly while reading live data.
  Not a client-only SPA.
- Styling: **Tailwind CSS**
- Database: **MongoDB Atlas** (Mongoose). The product catalog and all orders live in the DB.
- Admin dashboard: a custom **`/admin`** back-office (built in-app, not a separate server) lets
  the non-technical client manage products and view/update orders in the browser.
  _(This replaces the earlier "Phase 2 = Sanity CMS" plan — we built a custom admin + DB instead.)_
- Ordering: **cart → save order to DB, then pre-filled WhatsApp message** (wa.me deep link).
  Orders are persisted (customer + items + status). No online card payment.
- Product images: **Cloudinary** upload (or a pasted image URL) — no local disk, Vercel-safe.
- Deployment: **Vercel** (needs env vars — see "Data & admin" below).

### Data & admin

- Shared types + static category list: `codebase/lib/products.ts` (client-safe, no DB imports).
- Server-only DB access: `codebase/lib/data/products.ts`; connection in `codebase/lib/db.ts`.
- Models: `codebase/models/{Product,Order,Admin}.ts`. API: `codebase/app/api/…`
  (public `POST /api/orders`; protected `/api/admin/*`). Auth = single admin, JWT httpOnly
  cookie (`jose`), enforced by `codebase/middleware.ts`. Public storefront lives under
  `app/(site)/`; admin under `app/admin/` (noindex).
- **Setup:** create `codebase/.env.local` from `.env.example`
  (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, optional `CLOUDINARY_*`),
  then `npm run seed` to load the seed catalog + create the admin. DB accessors fail soft
  (empty catalog) when no DB is configured, so dev/build never crash.
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
