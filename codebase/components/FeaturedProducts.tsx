"use client";

import ProductCard from "./ProductCard";
import { useFeatured } from "@/lib/catalog";

// Live "featured" grid (bestsellers + new arrivals). Seeds from the baked snapshot
// for SSR, then refreshes from the API so new products appear without a rebuild.
export default function FeaturedProducts({ limit = 8 }: { limit?: number }) {
  const featured = useFeatured(limit);
  if (!featured.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {featured.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
