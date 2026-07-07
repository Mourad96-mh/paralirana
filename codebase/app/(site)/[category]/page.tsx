import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { categories, getCategory } from "@/lib/products";
import { getProductsByCategory } from "@/lib/data/products";
import { SITE_URL } from "@/lib/format";
import CategoryView from "@/components/CategoryView";


export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const cat = getCategory(params.category);
  if (!cat) return {};
  const description = `${cat.name} : ${cat.tagline}. Marques authentiques à prix discount, commande sur WhatsApp et livraison partout au Maroc — Para Lirana.`;
  const ogImage = cat.image
    ? cat.image.startsWith("http")
      ? cat.image
      : `${SITE_URL}${cat.image}`
    : undefined;
  return {
    title: `${cat.name} — Parapharmacie en ligne au Maroc`,
    description,
    alternates: { canonical: `/${cat.slug}` },
    openGraph: {
      title: `${cat.name} — Para Lirana`,
      description,
      url: `/${cat.slug}`,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, alt: cat.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} — Para Lirana`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const items = await getProductsByCategory(cat.slug);

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        / <span className="text-ink">{cat.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-green">
          {cat.icon} {cat.name}
        </h1>
        <p className="mt-1 text-muted">{cat.tagline}</p>
      </header>

      <Suspense fallback={null}>
        <CategoryView
          categorySlug={cat.slug}
          products={items}
          subcategories={cat.subcategories}
        />
      </Suspense>
    </div>
  );
}
