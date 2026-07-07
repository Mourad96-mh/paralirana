import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug } from "@/lib/data/products";
import { SITE_URL } from "@/lib/format";
import ProductDetail from "@/components/ProductDetail";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail initial={product} />
    </>
  );
}
