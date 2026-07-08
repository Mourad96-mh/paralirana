"use client";

import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/lib/catalog";

// Rotating product-image backdrop for the hero. Seeds from the baked catalog
// (SSR) then refreshes live from the API, so new products join the rotation
// without a rebuild. Crossfades through product photos; falls back to the
// static /hero.jpg when no product images are available.
export default function HeroCarousel({
  intervalMs = 5000,
  max = 8,
}: {
  intervalMs?: number;
  max?: number;
}) {
  const { products } = useCatalog();

  const slides = useMemo(() => {
    const withImage = products.filter((p) => p.image);
    // Spotlight bestsellers / new arrivals first, then the rest.
    const score = (p: (typeof withImage)[number]) =>
      (p.isBestseller ? 2 : 0) + (p.isNew ? 1 : 0);
    return [...withImage]
      .sort((a, b) => score(b) - score(a))
      .slice(0, max)
      .map((p) => ({ id: p.id, image: p.image as string }));
  }, [products, max]);

  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setI((n) => (n + 1) % slides.length),
      intervalMs
    );
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  if (!slides.length) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden
      />
    );
  }

  const active = i % slides.length;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === active ? 1 : 0 }}
        >
          {/* Blurred copy fills the whole banner (no empty edges) */}
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-2xl"
            style={{ backgroundImage: `url('${s.image}')` }}
          />
          {/* Sharp product, shown in full (not zoomed) on top */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${s.image}')` }}
          />
        </div>
      ))}
    </div>
  );
}
