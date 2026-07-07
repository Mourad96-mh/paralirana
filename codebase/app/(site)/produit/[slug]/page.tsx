import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory } from "@/lib/products";
import {
  getProducts,
  getProductBySlug,
  getRelated,
} from "@/lib/data/products";
import { formatMAD, SITE_URL } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 3600;

// Absolute URL for a stored image path — required by JSON-LD and reliable for
// Open Graph (relative OG image paths aren't consistently resolved to absolute).
function toAbsolute(src?: string): string | undefined {
  if (!src) return undefined;
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return {};
  const ogImage = toAbsolute(p.image);
  return {
    title: `${p.name} — ${p.brand} | Prix Maroc`,
    description: p.shortDescription,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: {
      title: `${p.name} — ${p.brand}`,
      description: p.shortDescription,
      url: `/produit/${p.slug}`,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, alt: p.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — ${p.brand}`,
      description: p.shortDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const cat = getCategory(product.category);
  const related = await getRelated(product);
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  const absoluteImage = toAbsolute(product.image);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.shortDescription,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    // Only emit aggregateRating when there are real reviews — Google flags a
    // rating with reviewCount 0 as an invalid rich result.
    ...(product.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/produit/${product.slug}`,
    },
  };

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        /{" "}
        {cat && (
          <>
            <Link href={`/${cat.slug}`} className="hover:text-gold-dark">
              {cat.name}
            </Link>{" "}
            /{" "}
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative">
          <ProductImage
            brand={product.brand}
            name={product.name}
            src={product.image}
            className="aspect-square w-full rounded-2xl"
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-white">
              -{discount}%
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-green">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted">
            <span className="text-gold">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span>
              {product.rating} ({product.reviews} avis)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-green">
              {formatMAD(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-muted line-through">
                {formatMAD(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-4 text-ink/80">{product.shortDescription}</p>

          <ul className="mt-5 space-y-1.5">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink/80">
                <span className="text-gold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 max-w-sm">
            <AddToCartButton product={product} />
            <p className="mt-2 text-center text-xs text-muted">
              Ajoutez au panier puis commandez sur WhatsApp — paiement à la
              livraison.
            </p>
          </div>
        </div>
      </div>

      {/* Details: description, conseil d'utilisation, composition */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-green">
            Description
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">
            {product.description}
          </p>
        </div>
        {product.conseils && (
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-green">
              Conseil d&apos;utilisation
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {product.conseils}
            </p>
          </div>
        )}
        {product.composition && (
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-green">
              Composition
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {product.composition}
            </p>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-green">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
