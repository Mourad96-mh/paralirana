"use client";

import ProductCard from "./ProductCard";
import WhatsAppIcon from "./WhatsAppIcon";
import { useByBrand } from "@/lib/catalog";
import { waLink } from "@/lib/format";

// Live product grid for a brand page. Falls back to a WhatsApp CTA when the brand
// has no products yet. Refreshes from the API so newly added products show up.
export default function BrandProducts({ brandName }: { brandName: string }) {
  const products = useByBrand(brandName);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-cream p-8 text-center">
        <p className="text-ink/70">
          Le catalogue {brandName} arrive très bientôt sur Para Lirana. Dites-nous le
          produit que vous cherchez et nous vous l&apos;obtenons.
        </p>
        <a
          href={waLink(`Bonjour Para Lirana 🙂 Je cherche un produit ${brandName}.`)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green px-5 py-3 font-semibold text-white transition hover:bg-green-dark"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Demander un produit {brandName} sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
