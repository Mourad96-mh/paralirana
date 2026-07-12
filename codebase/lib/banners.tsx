"use client";

// Live hero banners (hybrid build-time + runtime, same pattern as
// lib/categories.tsx but as a standalone hook — a single component consumes it).
//  - Initial render (static HTML) uses the baked snapshot → no hydration shift.
//  - On mount, fetch the live list from the API and refresh → banners created
//    in the admin appear immediately, without a rebuild.
//
// Replacement rule differs from categories: an EMPTY live list replaces the
// baked snapshot too, because "zero active banners" is a deliberate admin
// action and the hero must fall back to the product carousel — not keep showing
// stale baked banners. Only a fetch FAILURE (null) keeps the snapshot.

import { useEffect, useState } from "react";
import type { Banner } from "@/lib/products";
import { banners as BAKED, normalizeBanners } from "@/lib/products";

const API = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchLive(): Promise<Banner[] | null> {
  if (!API) return null;
  try {
    const r = await fetch(`${API}/api/banners`, { cache: "no-store" });
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data) ? normalizeBanners(data) : null;
  } catch {
    return null;
  }
}

export function useBanners(): { banners: Banner[]; ready: boolean } {
  const [banners, setBanners] = useState<Banner[]>(BAKED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchLive().then((live) => {
      if (alive && live) {
        setBanners(live);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { banners, ready };
}
