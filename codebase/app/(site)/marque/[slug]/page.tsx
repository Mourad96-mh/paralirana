import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  featuredBrands,
  getBrand,
  getBrandContent,
} from "@/lib/brands";
import { getProductsByBrand } from "@/lib/data/products";
import { SITE_URL, waLink } from "@/lib/format";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export function generateStaticParams() {
  return featuredBrands.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const brand = getBrand(params.slug);
  if (!brand) return {};
  return {
    // Root layout appends " | Para Lirana". "Prix Maroc" matches search intent.
    title: `${brand.name} Maroc — Prix discount & parapharmacie en ligne`,
    description: `Achetez vos produits ${brand.name} au Maroc au meilleur prix : soins authentiques à prix discount, commande sur WhatsApp et livraison partout au Maroc — Para Lirana.`,
    alternates: { canonical: `/marque/${brand.slug}` },
  };
}

export default async function BrandPage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = getBrand(params.slug);
  if (!brand) notFound();

  const content = getBrandContent(brand);
  const products = await getProductsByBrand(brand.name);
  const url = `${SITE_URL}/marque/${brand.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: brand.name, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListJsonLd =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Produits ${brand.name}`,
          itemListElement: products.slice(0, 20).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/produit/${p.slug}`,
            name: p.name,
          })),
        }
      : null;

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        / <span className="text-ink">{brand.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-green sm:text-4xl">
          {brand.name} Maroc
        </h1>
        <p className="mt-2 text-lg text-muted">{content.tagline}</p>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/80">
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </header>

      {/* Products */}
      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-green">
          Produits {brand.name}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/5 bg-cream p-8 text-center">
            <p className="text-ink/70">
              Le catalogue {brand.name} arrive très bientôt sur Para Lirana.
              Dites-nous le produit que vous cherchez et nous vous l&apos;obtenons.
            </p>
            <a
              href={waLink(
                `Bonjour Para Lirana 🙂 Je cherche un produit ${brand.name}.`
              )}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-3 font-semibold text-white transition hover:bg-green-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Demander un produit {brand.name} sur WhatsApp
            </a>
          </div>
        )}
      </section>

      {/* Buying guide */}
      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 font-display text-2xl font-bold text-green">
          Bien choisir vos soins {brand.name}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {content.guide.map((g) => (
            <div key={g.title} className="rounded-2xl border border-black/5 p-5">
              <h3 className="font-semibold text-green">{g.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12 max-w-3xl">
        <h2 className="mb-4 font-display text-2xl font-bold text-green">
          Questions fréquentes — {brand.name}
        </h2>
        <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
          {content.faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-green">
                {f.q}
                <span className="ml-4 text-gold transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other brands — internal linking */}
      <section className="border-t border-black/5 pt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Autres marques
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {featuredBrands
            .filter((b) => b.slug !== brand.slug)
            .map((b) => (
              <Link
                key={b.slug}
                href={`/marque/${b.slug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-green transition hover:border-gold hover:text-gold-dark"
              >
                {b.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
