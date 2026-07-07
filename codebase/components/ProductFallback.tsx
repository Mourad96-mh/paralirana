"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { normalizeCatalog } from "@/lib/data/products";
import ProductDetail from "./ProductDetail";

const API = process.env.NEXT_PUBLIC_API_URL || "";

// Fallback for a product whose static page doesn't exist yet (added after the last
// build). Fetches it live from the API by slug and renders the normal detail view.
// Once the site is rebuilt, the product gets its own static SEO page and this path
// is no longer hit.
export default function ProductFallback({ slug }: { slug: string }) {
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/products/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        if (!r.ok) throw new Error("not found");
        const [p] = normalizeCatalog([await r.json()]);
        if (alive) {
          setProduct(p);
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

  if (state === "missing" || !product) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-5xl font-bold text-green">404</h1>
        <p className="text-muted">Ce produit n&apos;existe pas ou n&apos;est plus disponible.</p>
        <Link
          href="/"
          className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-white hover:bg-gold-dark"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return <ProductDetail initial={product} />;
}
