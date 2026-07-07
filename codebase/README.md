# Para Lirana — Storefront (Next.js)

Parapharmacie en ligne au Maroc. Catalog browsing with **WhatsApp ordering** (no
online payment in v1). Built with Next.js 14 (App Router), TypeScript and Tailwind CSS.

## Run it locally

```bash
cd codebase
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Configure before launch

Edit `.env.local`:

- `NEXT_PUBLIC_WHATSAPP` — your WhatsApp number in international format, e.g.
  `212612345678` (no `+`, no spaces). This powers every "Commander sur WhatsApp"
  button and the cart order message.
- `NEXT_PUBLIC_SITE_URL` — your final domain, e.g. `https://paralirana.ma`. Used for
  the sitemap, canonicals and metadata.

## Pages

| Route                     | What it is                                  |
| ------------------------- | ------------------------------------------- |
| `/`                       | Homepage — hero, categories, featured       |
| `/[category]`             | Category listing with brand/price filters   |
| `/produit/[slug]`         | Product detail + add to cart                |
| `/panier`                 | Cart → builds the WhatsApp order message    |
| `/contact`                | Contact / WhatsApp                          |
| `/sitemap.xml`, `/robots.txt` | Auto-generated for SEO                  |

## Where the data lives

All products and categories are in **`lib/products.ts`** — seeded mock data using
real parapharmacy brands and representative MAD prices. **Replace these with the
client's real catalog.** Product photos are placeholders (`components/ProductImage.tsx`);
swap in real images when ready.

### Phase 2 — let the client manage products

The client is non-technical, so the plan is to move the catalog to **Sanity CMS**
(free tier, visual editor in the browser). At that point `lib/products.ts` is replaced
by a Sanity query; pages don't change much. Until then, products are edited in code.

## SEO

- Per-page `<title>` + meta description, self-referencing canonicals
- `Product` JSON-LD on product pages, `Pharmacy`/LocalBusiness on the layout
- Auto `sitemap.xml` + `robots.txt`
- French locale (`fr-FR`), crawlable static HTML per route

## Deploy

Push to GitHub and import into **Vercel** (recommended) or Netlify. Set the two env
vars in the host dashboard. Then submit the sitemap in Google Search Console.
