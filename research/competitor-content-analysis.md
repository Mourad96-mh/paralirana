# Para Lirana — Casablanca Competitor Content Analysis (SEO)

**Date:** 2026-07-03 · **Goal:** out-content the ranking parapharmacies for
"parapharmacie casablanca / en ligne maroc" and win the SERP.

## 1. Who actually ranks (Casablanca / national, organic)

Domains that repeat across multiple SERPs (strongest signal first):

| Domain | Note |
|---|---|
| cotepara.ma | "Côté Para — N°1 parapharmacie en ligne" (market leader) |
| atelierpara.ma | Casablanca (Anfa), very content-heavy, ranks #1 on several queries |
| novapara.ma | Pharmacist-founded angle, packs & routines, blog |
| votrepara.ma | 24h/24, free Casa delivery |
| parapharma.ma | Long-running national player |
| mapara.ma | "1ère parapharmacie", 50+ brands, catalog-heavy |
| paracasa.ma / para-casa.ma | Casablanca, physical address |
| azana.ma, paravitalia.com, parapharmaciecasablanca.ma, paramise.ma, chezpara.ma, natureoshop.com | long tail |

## 2. The winning homepage pattern (what they all do)

Analyzed atelierpara.ma, novapara.ma, mapara.ma in depth. Consistent structure:

1. **Keyword-rich H1** — "Parapharmacie en ligne **de référence au Maroc**" / "à Casablanca".
2. **Intro SEO paragraph** — location (Casablanca), *grandes marques*, *meilleur prix*,
   *livraison partout au Maroc*, + **expert positioning** ("conseillères beauté/santé",
   "fondée par un pharmacien", "dermo-conseillères").
3. **Product rails** — Nouveautés · Top ventes / Coups de cœur · Promotions/Offres.
4. **Category promo blocks** — usually Solaire, Minceur, Compléments (the money categories).
5. **Brand wall** — 15–50+ brand names/logos (each brand name = SEO surface + trust).
6. **Trust value props (4)** — livraison gratuite (with **dirham thresholds**), paiement à
   la livraison, produits 100% authentiques, points fidélité / experts.
7. **Delivery-info block** — zones + thresholds + délais (Casa same-day; other cities 24–48h).
8. **Blog/conseils teasers** — "Nos conseils & actualités santé" (funnels long-tail).
9. **Newsletter** capture.
10. **Rich footer** — category links, brand links, legal, contact, **Casablanca address + phone**.
11. Some add an **FAQ** and a long-form SEO paragraph near the footer.

Core copy depth: **~800–1,000 words**, heavy internal linking to category & brand pages,
concrete delivery/authenticity/expert trust signals.

## 3. Para Lirana today (the gap)

Current homepage = hero + 4-icon trust bar + 8 category tiles + featured rail + tiny CTA.
Missing vs competitors:
- ❌ No intro SEO paragraph / keyword-rich narrative (almost no indexable body text)
- ❌ No brand wall (we have brands in catalog but don't surface them)
- ❌ No expert/authenticity narrative ("pourquoi nous choisir")
- ❌ No delivery specifics, no FAQ, no blog teasers
- ❌ Thin footer, minimal internal linking
- ❌ Featured rail is empty until the DB is seeded → page looks even smaller

## 4. Plan to beat them (original copy only — NEVER copy their text; CLAUDE.md rule)

**Homepage rebuild (no invented business facts needed):**
- Keyword H1 + intro SEO paragraph (parapharmacie en ligne Maroc / Casablanca, marques
  authentiques, prix discount, livraison, WhatsApp).
- "Pourquoi Para Lirana" value props (authenticité, prix discount, conseil, WhatsApp/COD).
- Category grid **with descriptions** (already have taglines — expand).
- Brand wall built from the catalog (`getAllBrands()`), links to future /marque pages.
- "Nos catégories phares" promo blocks (Solaire = "écran solaire", Compléments, Capillaire).
- FAQ block (with FAQPage JSON-LD) — commande WhatsApp, livraison, authenticité, paiement.
- Long-form SEO section near footer + enriched footer internal links.

**Needs client facts before finalizing trust copy:** delivery thresholds (dirhams) & délais,
Casablanca address + phone (for LocalBusiness schema), whether we build a **blog** and **/marque**
+ city pages (the ~28k/mo brand + ~22k/mo city opportunities from keyword-analysis.md).

**Bigger SEO wins (separate waves):** city pages `/parapharmacie/{ville}` (only Casablanca
exists), brand hubs `/marque/{brand}`, and a conseils/blog — see research/keyword-analysis.md.
