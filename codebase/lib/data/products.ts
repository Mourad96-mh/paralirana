// ---------------------------------------------------------------------------
// Server-only product data access (MongoDB).
//
// Replaces the old static helpers from lib/products.ts. Every function returns
// plain, serializable `Product` objects (safe to pass to Client Components).
// Accessors fail SOFT: if the DB is unreachable they log a warning and return
// empty results so `next build` never hard-crashes on a missing connection.
// ---------------------------------------------------------------------------

import "server-only";
import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import type { Product } from "@/lib/products";

type LeanProduct = {
  _id: unknown;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  image?: string;
  shortDescription?: string;
  description?: string;
  conseils?: string;
  composition?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  newArrival?: boolean; // stored name for the app-facing `isNew` (reserved key)
  isBestseller?: boolean;
};

function toProduct(doc: LeanProduct): Product {
  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand,
    category: doc.category,
    subcategory: doc.subcategory ?? undefined,
    price: doc.price,
    oldPrice: doc.oldPrice ?? undefined,
    image: doc.image ?? undefined,
    shortDescription: doc.shortDescription ?? "",
    description: doc.description ?? "",
    conseils: doc.conseils ?? "",
    composition: doc.composition ?? "",
    features: doc.features ?? [],
    rating: doc.rating ?? 0,
    reviews: doc.reviews ?? 0,
    inStock: doc.inStock ?? true,
    isNew: doc.newArrival ?? false,
    isBestseller: doc.isBestseller ?? false,
  };
}

async function queryProducts(
  filter: Record<string, unknown> = {}
): Promise<Product[]> {
  try {
    await connectDB();
    const docs = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .lean<LeanProduct[]>();
    return docs.map(toProduct);
  } catch (err) {
    console.warn(
      "[products] DB unavailable, returning empty list:",
      (err as Error).message
    );
    return [];
  }
}

export function getProducts(): Promise<Product[]> {
  return queryProducts();
}

export function getProductsByCategory(slug: string): Promise<Product[]> {
  return queryProducts({ category: slug });
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match by brand name, case-insensitive exact (products store the display name,
// e.g. "Eucerin"). Brand names come from our curated list, but we escape anyway.
export function getProductsByBrand(name: string): Promise<Product[]> {
  return queryProducts({
    brand: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
  });
}

// Accent- + case-insensitive search over name + brand + shortDescription.
// MongoDB $regex ignores collation (so "avene" would miss "Avène"), and the
// catalog is small, so we normalize and match in memory instead. Every token in
// the query must appear somewhere in the product's searchable text.
const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export async function searchProducts(query: string): Promise<Product[]> {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const all = await getProducts();
  return all.filter((p) => {
    const haystack = normalize(`${p.name} ${p.brand} ${p.shortDescription}`);
    return tokens.every((t) => haystack.includes(t));
  });
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    await connectDB();
    const doc = await ProductModel.findOne({ slug }).lean<LeanProduct | null>();
    return doc ? toProduct(doc) : undefined;
  } catch (err) {
    console.warn(
      "[products] DB unavailable for slug",
      slug,
      (err as Error).message
    );
    return undefined;
  }
}

export async function getFeatured(limit = 8): Promise<Product[]> {
  const all = await queryProducts({
    $or: [{ isBestseller: true }, { newArrival: true }],
  });
  return all.slice(0, limit);
}

export async function getAllBrands(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.map((p) => p.brand))).sort();
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  const inCategory = await getProductsByCategory(product.category);
  return inCategory.filter((p) => p.id !== product.id).slice(0, limit);
}
