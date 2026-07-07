import Link from "next/link";
import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { categories, getCategory } from "@/lib/products";
import { getFeatured } from "@/lib/data/products";
import { featuredBrands } from "@/lib/brands";
import ProductCard from "@/components/ProductCard";


// Money categories to spotlight (from research/keyword-analysis.md: "écran solaire"
// and compléments are the breakout intents; capillaire is a strong money category).
const spotlight = [
  {
    slug: "solaire",
    title: "Écran solaire",
    copy: "Protégez votre peau du soleil marocain toute l'année. Écrans SPF 50+ visage et corps des marques dermatologiques de référence.",
  },
  {
    slug: "complements-alimentaires",
    title: "Compléments alimentaires",
    copy: "Vitamines, cheveux, immunité, minceur et énergie. Des cures ciblées pour accompagner votre santé au quotidien.",
  },
  {
    slug: "capillaire",
    title: "Soins capillaires",
    copy: "Chute, pellicules, cuir chevelu sensible ou cheveux abîmés : shampoings et soins traitants pour chaque besoin.",
  },
];

const faqs = [
  {
    q: "Comment passer commande sur Para Lirana ?",
    a: "C'est simple : ajoutez vos produits au panier, renseignez votre nom, téléphone et ville, puis validez. Votre commande s'ouvre dans une conversation WhatsApp pré-remplie — vous confirmez et nous nous occupons du reste.",
  },
  {
    q: "Vos produits sont-ils 100% authentiques ?",
    a: "Oui. Nous ne vendons que des produits d'origine des marques officielles de parapharmacie (La Roche-Posay, Avène, Bioderma, Eucerin, Vichy, Mustela…). Aucune contrefaçon, jamais.",
  },
  {
    q: "Livrez-vous partout au Maroc ?",
    a: "Oui, nous livrons dans toutes les villes du Maroc — Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Salé et au-delà. Le délai et les modalités vous sont confirmés lors de la commande.",
  },
  {
    q: "Quels sont les modes de paiement ?",
    a: "Le paiement se fait à la livraison (cash à la réception). Pas besoin de carte bancaire : vous ne payez qu'une fois votre commande reçue.",
  },
  {
    q: "Vos prix sont-ils moins chers qu'en pharmacie ?",
    a: "Oui. Para Lirana propose vos marques de parapharmacie préférées à prix discount, souvent en dessous des prix pratiqués en pharmacie physique, avec des promotions régulières.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function HomePage() {
  const featured = await getFeatured(8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section
        className="relative bg-green bg-cover bg-right text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(18,32,9,0.94) 0%, rgba(30,52,17,0.86) 34%, rgba(43,74,17,0.55) 62%, rgba(43,74,17,0.20) 100%), url('/hero.jpg')",
        }}
      >
        <div className="container py-20 lg:py-28">
          <div className="max-w-xl">
            <p className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-light">
              Parapharmacie en ligne · Maroc
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Parapharmacie en ligne au Maroc,
              <br />
              <span className="text-gold">à prix discount</span>
            </h1>
            <p className="mt-4 max-w-md text-white/85">
              Soins visage, capillaire, solaire, bébé et compléments
              alimentaires. Produits 100% authentiques, commande facile sur
              WhatsApp et livraison partout au Maroc.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/visage"
                className="rounded-lg bg-gold px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-gold-dark"
              >
                Découvrir la boutique
              </Link>
              <Link
                href="/complements-alimentaires"
                className="rounded-lg border border-white/40 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Compléments alimentaires
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-black/5 bg-white">
        <div className="container grid grid-cols-2 gap-4 py-6 text-center sm:grid-cols-4">
          {[
            ["✅", "100% authentique"],
            ["🚚", "Livraison Maroc"],
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

      {/* Intro / SEO */}
      <section className="container py-14">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-green sm:text-3xl">
            Votre parapharmacie en ligne au Maroc
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink/80">
            <p>
              Para Lirana est la parapharmacie en ligne qui rend les grandes
              marques de soin accessibles à tous les Marocains. De Casablanca à
              Rabat, Marrakech, Tanger ou Agadir, retrouvez des milliers de
              produits authentiques — soins du visage, du corps, capillaires,
              solaires, hygiène, maquillage, bébé et maman — à prix discount,
              sans vous déplacer en pharmacie.
            </p>
            <p>
              Notre sélection réunit les références plébiscitées par les
              dermatologues et pharmaciens : La Roche-Posay, Avène, Bioderma,
              Eucerin, Vichy, Uriage, CeraVe, Mustela et bien d'autres. Que vous
              cherchiez un écran solaire SPF 50, un sérum à la vitamine C, une
              crème hydratante pour peau sensible ou une cure de compléments
              alimentaires, vous commandez en quelques clics sur WhatsApp et vous
              êtes livré partout au Maroc, avec paiement à la livraison.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container pb-4">
        <h2 className="font-display text-2xl font-bold text-green">
          Parcourir par catégorie
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group overflow-hidden rounded-xl border border-black/5 bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-cream/60">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
                    {c.icon}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-green">{c.name}</h3>
                <p className="mt-1 text-xs text-muted">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Spotlight money categories */}
      <section className="container py-14">
        <h2 className="font-display text-2xl font-bold text-green">
          Nos catégories phares
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {spotlight.map((s) => {
            const cat = getCategory(s.slug);
            return (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex flex-col rounded-2xl border border-black/5 bg-cream p-6 transition hover:shadow-md"
              >
                <span className="text-3xl">{cat?.icon}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-green">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{s.copy}</p>
                <span className="mt-4 text-sm font-semibold text-gold-dark group-hover:underline">
                  Découvrir →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products (shows once the catalog is seeded) */}
      {featured.length > 0 && (
        <section className="container pb-4">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-green">
              Sélection du moment
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
      )}

      {/* Why Para Lirana */}
      <section className="bg-white">
        <div className="container py-14">
          <h2 className="font-display text-2xl font-bold text-green">
            Pourquoi choisir Para Lirana ?
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🛡️",
                title: "Produits 100% authentiques",
                text: "Uniquement des produits d'origine des marques officielles. Zéro contrefaçon, la même qualité qu'en pharmacie.",
              },
              {
                icon: "💰",
                title: "Prix discount toute l'année",
                text: "Vos marques préférées moins chères, avec des promotions régulières sur les best-sellers.",
              },
              {
                icon: "💬",
                title: "Conseil & commande sur WhatsApp",
                text: "Une question sur un produit ou une routine ? On vous répond et on prend votre commande directement sur WhatsApp.",
              },
              {
                icon: "🚚",
                title: "Livraison partout au Maroc",
                text: "Livraison dans toutes les villes du Royaume, avec paiement à la livraison en toute confiance.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-black/5 p-5">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 font-semibold text-green">{v.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand wall */}
      <section className="container py-14">
        <h2 className="font-display text-2xl font-bold text-green">
          Nos grandes marques
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Les marques de parapharmacie les plus recherchées au Maroc, réunies au
          même endroit et au meilleur prix.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {featuredBrands.map((b) => (
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

      {/* FAQ */}
      <section className="bg-cream">
        <div className="container py-14">
          <h2 className="font-display text-2xl font-bold text-green">
            Questions fréquentes
          </h2>
          <div className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
            {faqs.map((f) => (
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
        </div>
      </section>

      {/* Long-form SEO + CTA */}
      <section className="bg-gold/10">
        <div className="container py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-green">
              Prenez soin de vous, on s'occupe du reste
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/75">
              Acheter sa parapharmacie en ligne au Maroc n'a jamais été aussi
              simple. Chez Para Lirana, vous comparez, vous choisissez et vous
              commandez vos soins dermo-cosmétiques, vos compléments alimentaires
              et vos produits d'hygiène en toute sérénité, avec le conseil d'une
              équipe à votre écoute. Des routines visage aux soins bébé, du sérum
              anti-âge à l'écran solaire, nous rassemblons l'essentiel des grandes
              marques pour toute la famille — livré chez vous, partout au Royaume.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 font-semibold text-white transition hover:bg-green-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Nous contacter sur WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
