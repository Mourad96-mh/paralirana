# Deployment — Para Lirana (split architecture)

Two pieces, deployed separately:

```
paralirana.com  (Hostinger: domain + static frontend)
   └─ static HTML/JS in codebase/out/  ← uploaded to Hostinger public_html
        │  calls (browser fetch, CORS) ↓
   paralirana-api.onrender.com  (Render: Express API — codebase/server/)
        ├─ MongoDB Atlas   (catalog + orders + admin)
        └─ Cloudinary      (product images)
```

- **Frontend** = Next.js **static export** (`output: 'export'`) → `codebase/out/`. Hosted on **Hostinger**.
- **Backend** = **Express API** in `codebase/server/` → hosted on **Render**.
- The storefront HTML is baked at build (SEO) from a catalog snapshot, and refreshes
  live from the API in the browser. Admin + orders talk to the API directly.

---

## 1. Backend — Express API on Render

The repo has a `render.yaml` Blueprint (deploys `codebase/server`).

1. **dashboard.render.com** → New → Blueprint → pick the `paralirana` repo → Apply.
   (Service name `paralirana-api`, root `codebase/server`, Starter plan.)
2. In the service → **Environment**, set the real values (from `codebase/server/.env.example`):
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   (`CORS_ORIGIN` is preset to the paralirana.com domains.)
3. **MongoDB Atlas → Network Access → Allow 0.0.0.0/0** (Render has no fixed outbound IP).
4. Deploy → you get `https://paralirana-api.onrender.com`. Open it → `{"ok":true,...}`.
5. Seed once: Render service → **Shell** → `npm run seed` (creates admin + catalog).

## 2. Frontend — static site on Hostinger

Build locally (or in CI), then upload the `out/` folder.

1. In `codebase/.env.local` (or CI env), set:
   ```
   NEXT_PUBLIC_SITE_URL=https://paralirana.com
   NEXT_PUBLIC_WHATSAPP=2126XXXXXXXX
   NEXT_PUBLIC_API_URL=https://paralirana-api.onrender.com
   CONTENT_API_URL=https://paralirana-api.onrender.com
   ```
2. Build:
   ```
   cd codebase
   npm ci
   npm run build      # prebuild syncs the catalog from the API, then exports to out/
   ```
3. Upload the **contents of `codebase/out/`** into Hostinger's `public_html`
   (hPanel → File Manager, or FTP). That's the whole site.
4. Enable SSL for paralirana.com in hPanel (free Let's Encrypt).

Clean URLs work natively: `trailingSlash: true` emits `route/index.html`, which
Apache/LiteSpeed serves for `/route/`.

## Updating the catalog

- **Edit existing products / prices / stock / orders:** use `paralirana.com/admin`
  (writes to the API). Existing product pages refresh live in the browser.
- **Add a brand-new product (new URL):** it appears in listings live, but its own
  static SEO page needs a **rebuild + re-upload** of `out/` (step 2–3 above).
  Consider rebuilding on a schedule or via CI when you add products.
