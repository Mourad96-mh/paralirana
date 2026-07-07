import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cities, getCity } from "@/lib/cities";
import { categories } from "@/lib/products";
import { getFeatured } from "@/lib/data/products";
import { SITE_URL, waLink } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";


export function generateStaticParams() {
  return cities.map((c) => ({ ville: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { ville: string };
}): Metadata {
  const city = getCity(params.ville);
  if (!city) return {};
  return {
    title: `Parapharmacie en ligne à ${city.name} — Livraison & Prix discount`,
    description: `Parapharmacie en ligne à ${city.name} : soins visage, capillaire, solaire, bébé et compléments alimentaires des plus grandes marques à prix discount. Commande sur WhatsApp, livraison ${city.deliveryDelay} à ${city.name} — Para Lirana.`,
    alternates: { canonical: `/parapharmacie/${city.slug}` },
    openGraph: {
      title: `Parapharmacie en ligne à ${city.name} | Para Lirana`,
      description: `Vos marques de parapharmacie à prix discount, livrées à ${city.name}. Commande facile sur WhatsApp.`,
    },
  };
}

const faqFor = (cityName: string, delay: string) => [
  {
    q: `Livrez-vous la parapharmacie à ${cityName} ?`,
    a: `Oui, Para Lirana livre dans tous les quartiers de ${cityName}. La commande se fait sur WhatsApp et vous réglez à la livraison.`,
  },
  {
    q: `Quels sont les délais de livraison à ${cityName} ?`,
    a: `La livraison à ${cityName} prend généralement ${delay} après confirmation de votre commande sur WhatsApp.`,
  },
  {
    q: `Les produits sont-ils authentiques ?`,
    a: `Oui. Toutes nos références (La Roche-Posay, Avène, Bioderma, Eucerin, Vichy, Mustela…) sont 100% authentiques, aux mêmes prix discount partout au Maroc.`,
  },
  {
    q: `Comment commander depuis ${cityName} ?`,
    a: `Ajoutez vos produits au panier puis validez : un message WhatsApp pré-rempli est généré. Envoyez-le, et notre équipe confirme votre commande et la livraison à ${cityName}.`,
  },
];

export default async function CityPage({
  params,
}: {
  params: { ville: string };
}) {
  const city = getCity(params.ville);
  if (!city) notFound();

  const featured = await getFeatured(8);
  const faq = faqFor(city.name, city.deliveryDelay);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `Parapharmacie à ${city.name}`,
        item: `${SITE_URL}/parapharmacie/${city.slug}`,
      },
    ],
  };

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: `Para Lirana — Parapharmacie en ligne à ${city.name}`,
    description: `Parapharmacie en ligne livrée à ${city.name} : soins visage, capillaire, solaire, bébé et compléments alimentaires à prix discount.`,
    url: `${SITE_URL}/parapharmacie/${city.slug}`,
    areaServed: { "@type": "City", name: city.name },
    currenciesAccepted: "MAD",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressCountry: "MA",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green to-[#1f3454] text-white">
        <div className="container py-14 lg:py-20">
          <nav className="mb-4 text-sm text-white/70">
            <Link href="/" className="hover:text-gold-light">
              Accueil
            </Link>{" "}
            / <span className="text-white">Parapharmacie à {city.name}</span>
          </nav>
          <p className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-light">
            Livraison {city.deliveryDelay} · {city.name}
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            Parapharmacie en ligne à {city.name}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">{city.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/visage"
              className="rounded-lg bg-gold px-5 py-3 font-semibold text-white hover:bg-gold-dark"
            >
              Découvrir la boutique
            </Link>
            <a
              href={waLink(
                `Bonjour Para Lirana 🙂 Je suis à ${city.name} et je souhaite passer une commande.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-black/5 bg-white">
        <div className="container grid grid-cols-2 gap-4 py-6 text-center sm:grid-cols-4">
          {[
            ["✅", "100% authentique"],
            ["🚚", `Livraison à ${city.name}`],
            ["💬", "Commande WhatsApp"],
            ["💰", "Prix discount"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-medium text-green">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="font-display text-2xl font-bold text-green">
          Nos catégories livrées à {city.name}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-xl border border-black/5 bg-white p-5 transition hover:shadow-md"
            >
              <span className="text-3xl">{c.icon}</span>
              <h3 className="mt-3 font-semibold text-green">{c.name}</h3>
              <p className="mt-1 text-xs text-muted">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container pb-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-green">
            Sélection à prix discount
          </h2>
          <Link
            href="/visage"
            className="text-sm font-medium text-gold-dark hover:underline"
          >
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Delivery / districts */}
      <section className="container py-12">
        <div className="rounded-2xl border border-black/5 bg-white p-8">
          <h2 className="font-display text-2xl font-bold text-green">
            Livraison de parapharmacie dans tout {city.name}
          </h2>
          <p className="mt-3 max-w-3xl text-muted">
            Que vous soyez à {city.districts.slice(0, 3).join(", ")} ou ailleurs,
            Para Lirana livre votre commande de parapharmacie partout à{" "}
            {city.name} en {city.deliveryDelay}, avec paiement à la livraison.
            Commandez vos soins du visage, produits solaires, soins capillaires,
            articles bébé et compléments alimentaires aux meilleurs prix.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {city.districts.map((d) => (
              <span
                key={d}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-green"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-12">
        <h2 className="font-display text-2xl font-bold text-green">
          Questions fréquentes — livraison à {city.name}
        </h2>
        <div className="mt-6 space-y-3">
          {faq.map((f) => (
            <details
              key={f.q}
              className="rounded-xl border border-black/5 bg-white p-5"
            >
              <summary className="cursor-pointer font-semibold text-green">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold/10">
        <div className="container flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-green">
            Commandez votre parapharmacie à {city.name}
          </h2>
          <p className="max-w-md text-muted">
            Notre équipe vous conseille et prend votre commande sur WhatsApp, du
            lundi au samedi. Livraison à {city.name} en {city.deliveryDelay}.
          </p>
          <a
            href={waLink(
              `Bonjour Para Lirana 🙂 Je suis à ${city.name} et je souhaite passer une commande.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Commander sur WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
