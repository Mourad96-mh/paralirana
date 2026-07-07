import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatMAD } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/produit/${product.slug}`} className="relative block">
        <ProductImage
          brand={product.brand}
          name={product.name}
          src={product.image}
          className="aspect-square w-full"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Nouveau
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {product.brand}
        </p>
        <Link
          href={`/produit/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm font-medium text-ink hover:text-gold-dark"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-green">
              {formatMAD(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">
                {formatMAD(product.oldPrice)}
              </span>
            )}
          </div>
          <div className="mt-2">
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
