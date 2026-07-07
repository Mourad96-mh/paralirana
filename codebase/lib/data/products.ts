// ---------------------------------------------------------------------------
// Catalog data access for the STATIC EXPORT build.
//
// The source of truth is the Express API (server/, on Render). At build time
// scripts/sync-content.mjs fetches it and writes lib/catalog.data.json, which is
// baked into the static HTML here (SEO). This module is client-safe (no DB, no
// server-only import), so client components — e.g. the search page — can reuse
// the same finders. Functions stay async to keep the pages/components unchanged.
// ---------------------------------------------------------------------------

import rawCatalog from "@/lib/catalog.data.json";
import type { Product } from "@/lib/products";

// The snapshot may come from the seed (no _id) or the API (fromDbProduct → _id + isNew).
type RawProduct = Record<string, unknown> & {
  _id?: string;
  id?: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  newArrival?: boolean;
  isNew?: boolean;
};

function toProduct(d: RawProduct): Product {
  return {
    id: String(d.id ?? d._id ?? d.slug),
    slug: d.slug,
    name: d.name,
    brand: d.brand,
    category: d.category,
    subcategory: (d.subcategory as string) ?? undefined,
    price: d.price,
    oldPrice: (d.oldPrice as number) ?? undefined,
    image: (d.image as string) ?? undefined,
    shortDescription: (d.shortDescription as string) ?? "",
    description: (d.description as string) ?? "",
    conseils: (d.conseils as string) ?? "",
    composition: (d.composition as string) ?? "",
    features: (d.features as string[]) ?? [],
    rating: (d.rating as number) ?? 0,
    reviews: (d.reviews as number) ?? 0,
    inStock: (d.inStock as boolean) ?? true,
    isNew: ((d.isNew ?? d.newArrival) as boolean) ?? false,
    isBestseller: (d.isBestseller as boolean) ?? false,
  };
}

// Normalize an arbitrary catalog array (from the baked snapshot or a live API
// response) into app-facing Product[]. Reused by the client CatalogProvider.
export function normalizeCatalog(raw: unknown[]): Product[] {
  return (raw as RawProduct[]).map(toProduct);
}

const ALL: Product[] = normalizeCatalog(rawCatalog as unknown[]);

// Accent- + case-insensitive token search over any product list (client reuses this).
const normalizeText = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function searchIn(list: Product[], query: string): Product[] {
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return list.filter((p) => {
    const haystack = normalizeText(`${p.name} ${p.brand} ${p.shortDescription}`);
    return tokens.every((t) => haystack.includes(t));
  });
}

export function getProducts(): Promise<Product[]> {
  return Promise.resolve(ALL);
}

export function getProductsByCategory(slug: string): Promise<Product[]> {
  return Promise.resolve(ALL.filter((p) => p.category === slug));
}

export function getProductBySlug(slug: string): Promise<Product | undefined> {
  return Promise.resolve(ALL.find((p) => p.slug === slug));
}

// Brand match, case-insensitive exact (products store the display name, e.g. "Eucerin").
export function getProductsByBrand(name: string): Promise<Product[]> {
  const n = name.trim().toLowerCase();
  return Promise.resolve(ALL.filter((p) => p.brand.toLowerCase() === n));
}

// Accent- + case-insensitive search over the baked catalog.
export function searchProducts(query: string): Product[] {
  return searchIn(ALL, query);
}

export function getFeatured(limit = 8): Promise<Product[]> {
  const featured = ALL.filter((p) => p.isBestseller || p.isNew);
  return Promise.resolve(featured.slice(0, limit));
}

export function getAllBrands(): Promise<string[]> {
  return Promise.resolve(Array.from(new Set(ALL.map((p) => p.brand))).sort());
}

export function getRelated(product: Product, limit = 4): Promise<Product[]> {
  const inCategory = ALL.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  return Promise.resolve(inCategory.slice(0, limit));
}
