"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/lib/categories";
import type { Category } from "@/lib/products";

// Homepage "Parcourir par catégorie" grid — live from the API (same hybrid
// pattern as the Navbar/Footer), so a category created in the admin appears
// here without a rebuild. First paint uses the baked snapshot (SEO), then it
// refreshes live on mount.
//
// Note: a brand-NEW category's own page (/slug) is only generated at the next
// build + upload, so its tile links to a page that 404s until the next deploy —
// same caveat as the live Navbar menu and Footer.

// Matches next.config.mjs images.remotePatterns. Only local paths and Cloudinary
// uploads may go through next/image; any other host would make <Image> throw and
// crash the page, so those (e.g. an admin-pasted URL) fall back to a plain <img>.
// Same rule as components/ProductImage.tsx.
function isOptimizable(src: string): boolean {
  return src.startsWith("/") || src.includes("res.cloudinary.com");
}

function CategoryThumb({ category }: { category: Category }) {
  const src = category.image;

  if (src && isOptimizable(src)) {
    return (
      <Image
        src={src}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-contain p-3 transition duration-300 group-hover:scale-105"
      />
    );
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-4xl">
      {category.icon}
    </div>
  );
}

export default function CategoryGrid() {
  const { categories } = useCategories();

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/${c.slug}`}
          className="group overflow-hidden rounded-xl border border-black/5 bg-white transition hover:shadow-md"
        >
          <div className="relative aspect-square w-full bg-cream/60">
            <CategoryThumb category={c} />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-green">{c.name}</h3>
            <p className="mt-1 text-xs text-muted">{c.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
