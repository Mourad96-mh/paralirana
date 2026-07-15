"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/products";
import { normalizeCategories } from "@/lib/products";
import CategoryView from "./CategoryView";

const API = process.env.NEXT_PUBLIC_API_URL || "";

// Fallback for a category whose static page doesn't exist yet (created in the
// admin after the last build). Fetches the live category list, finds this slug,
// and renders the normal category layout — products fill in live via CategoryView's
// useCatalog(). Once the site is rebuilt, the category gets its own static SEO
// page and this path is no longer hit. Mirrors ProductFallback.
export default function CategoryFallback({ slug }: { slug: string }) {
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/categories`, { cache: "no-store" });
        if (!r.ok) throw new Error("not found");
        const data = await r.json();
        const cat = normalizeCategories(Array.isArray(data) ? data : []).find(
          (c) => c.slug === slug
        );
        if (!cat) throw new Error("not found");
        if (alive) {
          setCategory(cat);
          setState("found");
        }
      } catch {
        if (alive) setState("missing");
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="container flex justify-center py-24 text-muted">Chargement…</div>
    );
  }

  if (state === "missing" || !category) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-green">404</h1>
        <p className="text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-white hover:bg-gold-dark"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        / <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-green">
          {category.icon} {category.name}
        </h1>
        <p className="mt-1 text-muted">{category.tagline}</p>
      </header>

      <Suspense fallback={null}>
        <CategoryView
          categorySlug={category.slug}
          products={[]}
          subcategories={category.subcategories}
        />
      </Suspense>
    </div>
  );
}
