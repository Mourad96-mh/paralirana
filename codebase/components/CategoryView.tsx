"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, Subcategory } from "@/lib/products";
import ProductCard from "./ProductCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "new";

export default function CategoryView({
  products,
  subcategories = [],
}: {
  products: Product[];
  subcategories?: Subcategory[];
}) {
  const searchParams = useSearchParams();

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  // Only show subcategory chips that actually have products in this category.
  const availableSubs = useMemo(() => {
    const present = new Set(products.map((p) => p.subcategory).filter(Boolean));
    return subcategories.filter((s) => present.has(s.slug));
  }, [products, subcategories]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sort, setSort] = useState<SortKey>("popular");
  // Deep-linkable from the mega-menu: /visage?sub=nettoyants
  const initialSub = searchParams.get("sub") ?? "";
  const [selectedSub, setSelectedSub] = useState<string>(
    availableSubs.some((s) => s.slug === initialSub) ? initialSub : ""
  );

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedSub) list = list.filter((p) => p.subcategory === selectedSub);
    if (selectedBrands.length)
      list = list.filter((p) => selectedBrands.includes(p.brand));
    if (maxPrice > 0) list = list.filter((p) => p.price <= maxPrice);
    if (onlyPromo) list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "new":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, selectedSub, selectedBrands, maxPrice, onlyPromo, sort]);

  function toggleBrand(b: string) {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Filters */}
      <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-green">Marque</h3>
          <div className="space-y-1.5">
            {brands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="accent-gold"
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-green">
            Prix max : {maxPrice > 0 ? `${maxPrice} MAD` : "tous"}
          </h3>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-gold"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyPromo}
            onChange={(e) => setOnlyPromo(e.target.checked)}
            className="accent-gold"
          />
          En promotion uniquement
        </label>
      </aside>

      {/* Grid */}
      <div>
        {availableSubs.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSub("")}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selectedSub === ""
                  ? "border-green bg-green text-white"
                  : "border-black/10 bg-white text-ink hover:border-gold"
              }`}
            >
              Tout
            </button>
            {availableSubs.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSub(s.slug)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selectedSub === s.slug
                    ? "border-green bg-green text-white"
                    : "border-black/10 bg-white text-ink hover:border-gold"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">{filtered.length} produit(s)</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm"
          >
            <option value="popular">Les plus populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="new">Nouveautés</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-muted">
            Aucun produit ne correspond à ces filtres.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
