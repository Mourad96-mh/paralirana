"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-black/5 px-3 py-2 text-sm font-medium text-muted"
      >
        Rupture de stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-lg px-3 font-semibold text-white transition ${
        added ? "bg-emerald-600" : "bg-gold hover:bg-gold-dark"
      } ${compact ? "py-2 text-sm" : "py-3 text-base"}`}
    >
      {added ? "✓ Ajouté" : "Ajouter au panier"}
    </button>
  );
}
