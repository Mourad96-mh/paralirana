// ---------------------------------------------------------------------------
// Para Lirana — shared catalog TYPES + baked category config.
//
// This file is CLIENT-SAFE: it must never import Mongoose or any server-only
// code, because client components (Navbar, cart, ProductCard) import from here.
// Product DATA lives in the Express API / a build-time snapshot — see
// lib/data/products.ts (reads lib/catalog.data.json, client-safe).
//
// Categories are now DB-backed too: the source of truth is the Express API,
// synced at build into lib/categories.data.json (below). Server-rendered pages
// use this baked snapshot (SEO); the Navbar + admin refresh it live in the
// browser via lib/categories.tsx — same hybrid pattern as the catalog.
// ---------------------------------------------------------------------------

import rawCategories from "@/lib/categories.data.json";

export type Subcategory = {
  slug: string; // unique within its parent category
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  // simple emoji used as a lightweight icon in the UI
  icon: string;
  // representative image (path under /public) for category tiles
  image?: string;
  subcategories: Subcategory[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string; // Category.slug
  subcategory?: string; // Subcategory.slug within the parent category
  price: number; // MAD
  oldPrice?: number; // MAD, if on promo
  image?: string; // image URL (Cloudinary or external); optional → placeholder
  shortDescription: string;
  description: string;
  conseils?: string; // conseil d'utilisation
  composition?: string; // composition / ingrédients clés
  features: string[];
  rating: number; // 0-5
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
};

// Shape of a raw category coming from the baked snapshot or the live API.
type RawCategory = Record<string, unknown> & {
  slug: string;
  name: string;
  tagline?: string;
  icon?: string;
  image?: string;
  order?: number;
  subcategories?: { slug: string; name: string }[];
};

// Normalize an arbitrary category array (baked snapshot or live API response)
// into app-facing Category[], sorted by `order` then name. Reused by the client
// CategoriesProvider (lib/categories.tsx) so both paths share one shape.
export function normalizeCategories(raw: unknown[]): Category[] {
  return (raw as RawCategory[])
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline ?? "",
      icon: c.icon || "🏷️",
      image: (c.image as string) || undefined,
      order: typeof c.order === "number" ? c.order : 0,
      subcategories: Array.isArray(c.subcategories)
        ? c.subcategories.map((s) => ({ slug: s.slug, name: s.name }))
        : [],
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ order, ...c }) => c); // drop the sort-only `order` field
}

// Baked category snapshot — the SEO source of truth for server-rendered pages.
// Synced at build from the API by scripts/sync-content.mjs.
export const categories: Category[] = normalizeCategories(
  rawCategories as unknown[]
);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(
  categorySlug: string,
  subSlug: string
): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}
