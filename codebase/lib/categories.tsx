"use client";

// Live categories for the storefront + admin (hybrid build-time + runtime,
// same pattern as lib/catalog.tsx).
//  - Initial render (static HTML) uses the baked snapshot → SEO + no hydration shift.
//  - On mount, fetch the live list from the API (Render) and refresh → categories
//    created/edited in the admin appear immediately, without a rebuild.
//  - If the API is unreachable, we keep the baked snapshot (menu stays functional).
//
// Note: a brand-NEW category's own static page (/slug) is only generated at the
// next build + upload — like a brand-new product URL. Until then it appears in
// the live menu/dropdown but its dedicated page is created on the next deploy.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Category } from "@/lib/products";
import { categories as BAKED, normalizeCategories } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchLive(): Promise<Category[] | null> {
  if (!API) return null;
  try {
    const r = await fetch(`${API}/api/categories`, { cache: "no-store" });
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data) ? normalizeCategories(data) : null;
  } catch {
    return null;
  }
}

type CategoriesCtx = { categories: Category[]; ready: boolean };
const CategoriesContext = createContext<CategoriesCtx>({
  categories: BAKED,
  ready: false,
});

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(BAKED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchLive().then((live) => {
      if (alive && live && live.length) {
        setCategories(live);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, ready }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories(): CategoriesCtx {
  return useContext(CategoriesContext);
}

// Standalone hook (no provider needed) — used by admin pages, which live outside
// the storefront's CategoriesProvider. Seeds from the baked snapshot, then
// refreshes from the API on mount so freshly-created categories are selectable.
// `reload()` re-fetches on demand (e.g. after creating a category inline).
export function useLiveCategories(): CategoriesCtx & { reload: () => void } {
  const [categories, setCategories] = useState<Category[]>(BAKED);
  const [ready, setReady] = useState(false);

  const reload = useCallback(() => {
    fetchLive().then((live) => {
      if (live) {
        setCategories(live);
        setReady(true);
      }
    });
  }, []);

  useEffect(() => {
    let alive = true;
    fetchLive().then((live) => {
      if (alive && live) {
        setCategories(live);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { categories, ready, reload };
}
