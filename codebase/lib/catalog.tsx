"use client";

// Live catalog for the storefront (hybrid build-time + runtime, like algopharma).
//  - Initial render (static HTML) uses the build-time snapshot → SEO + no hydration shift.
//  - On mount, fetch the live catalog from the API (Render) and refresh → admin edits and
//    NEW products appear immediately, without rebuilding/re-uploading the static site.
//  - If the API is unreachable, we keep the baked snapshot (page stays functional).

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import rawCatalog from "@/lib/catalog.data.json";
import { normalizeCatalog } from "@/lib/data/products";

const API = process.env.NEXT_PUBLIC_API_URL || "";

// Baked snapshot, normalized once — the initial value (also the fallback outside a provider).
const BAKED: Product[] = normalizeCatalog(rawCatalog as unknown[]);

type CatalogCtx = { products: Product[]; ready: boolean };
const CatalogContext = createContext<CatalogCtx>({ products: BAKED, ready: false });

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(BAKED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!API) return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/products`, { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        if (alive && Array.isArray(data)) {
          setProducts(normalizeCatalog(data));
          setReady(true);
        }
      } catch {
        /* keep the baked snapshot */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <CatalogContext.Provider value={{ products, ready }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogCtx {
  return useContext(CatalogContext);
}

// --- convenience selectors bound to the live catalog ---------------------------

export function useFeatured(limit = 8): Product[] {
  const { products } = useCatalog();
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, limit);
}

export function useByCategory(slug: string): Product[] {
  const { products } = useCatalog();
  return products.filter((p) => p.category === slug);
}

export function useByBrand(name: string): Product[] {
  const { products } = useCatalog();
  const n = name.trim().toLowerCase();
  return products.filter((p) => p.brand.toLowerCase() === n);
}

export function useProductBySlug(slug: string): Product | undefined {
  const { products } = useCatalog();
  return products.find((p) => p.slug === slug);
}
