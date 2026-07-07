// ---------------------------------------------------------------------------
// Para Lirana — shared catalog TYPES + static category config.
//
// This file is CLIENT-SAFE: it must never import Mongoose or any server-only
// code, because client components (Navbar, cart, ProductCard) import from here.
// Product DATA now lives in MongoDB — see lib/data/products.ts (server-only).
// ---------------------------------------------------------------------------

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

// Categories + subcategories change rarely and are needed by client components
// (Navbar mega-menu, category filters), so they stay static here rather than in
// the database.
export const categories: Category[] = [
  {
    slug: "visage",
    name: "Visage",
    tagline: "Soins du visage, nettoyants et anti-âge",
    icon: "🧴",
    image: "/products/cerave-creme-hydratante-visage.png",
    subcategories: [
      { slug: "nettoyants", name: "Nettoyants & Démaquillants" },
      { slug: "hydratants", name: "Hydratants" },
      { slug: "serums", name: "Sérums & Traitements" },
      { slug: "anti-age", name: "Anti-âge" },
    ],
  },
  {
    slug: "corps",
    name: "Corps",
    tagline: "Hydratation et soins du corps",
    icon: "🫧",
    image: "/products/avene-cold-cream-corps.png",
    subcategories: [
      { slug: "hydratants-corps", name: "Laits & Crèmes corps" },
      { slug: "nettoyants-corps", name: "Gels & Baumes lavants" },
    ],
  },
  {
    slug: "capillaire",
    name: "Capillaire",
    tagline: "Shampoings, soins et accessoires cheveux",
    icon: "💇‍♀️",
    image: "/products/klorane-shampoing-ortie.png",
    subcategories: [
      { slug: "shampoings", name: "Shampoings" },
      { slug: "soins-cheveux", name: "Soins & Après-shampoings" },
      { slug: "complements-cheveux", name: "Compléments cheveux" },
    ],
  },
  {
    slug: "solaire",
    name: "Solaire",
    tagline: "Protection solaire visage et corps",
    icon: "☀️",
    image: "/products/la-roche-posay-anthelios-spf50.png",
    subcategories: [
      { slug: "solaire-visage", name: "Solaire visage" },
      { slug: "solaire-corps", name: "Solaire corps" },
    ],
  },
  {
    slug: "maquillage",
    name: "Maquillage",
    tagline: "Teint, yeux et lèvres",
    icon: "💄",
    image: "/products/vichy-dermablend-fond-de-teint.png",
    subcategories: [
      { slug: "teint", name: "Teint" },
      { slug: "yeux", name: "Yeux" },
      { slug: "levres", name: "Lèvres" },
    ],
  },
  {
    slug: "bebe-maman",
    name: "Bébé & Maman",
    tagline: "Soins doux pour bébé et maman",
    icon: "🍼",
    image: "/products/mustela-liniment-bebe.png",
    subcategories: [
      { slug: "bebe", name: "Soins bébé" },
      { slug: "maman", name: "Maternité" },
    ],
  },
  {
    slug: "complements-alimentaires",
    name: "Compléments Alimentaires",
    tagline: "Vitamines, cheveux, minceur, immunité",
    icon: "💊",
    image: "/products/biocyte-collagene-marin.png",
    subcategories: [
      { slug: "beaute", name: "Beauté (peau, cheveux, ongles)" },
      { slug: "vitalite", name: "Vitalité & Immunité" },
      { slug: "minceur", name: "Minceur" },
    ],
  },
  {
    slug: "hygiene",
    name: "Hygiène",
    tagline: "Hygiène quotidienne et intime",
    icon: "🧼",
    image: "/products/cattier-dentifrice-bio.png",
    subcategories: [
      { slug: "intime", name: "Hygiène intime" },
      { slug: "bucco-dentaire", name: "Bucco-dentaire" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(
  categorySlug: string,
  subSlug: string
): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}
