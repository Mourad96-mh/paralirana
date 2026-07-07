"use client";

import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";

// Client-side search over the baked catalog. The search page is static (noindex),
// so results are computed in the browser from the query string — no server needed.
export default function SearchClient() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = q ? searchProducts(q) : [];

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-green sm:text-3xl">
          {q ? <>Résultats pour «&nbsp;{q}&nbsp;»</> : "Rechercher un produit"}
        </h1>
        {q && (
          <p className="mt-1 text-muted">
            {results.length} produit{results.length > 1 ? "s" : ""} trouvé
            {results.length > 1 ? "s" : ""}
          </p>
        )}
      </header>

      {!q ? (
        <p className="rounded-xl bg-white p-8 text-center text-muted">
          Saisissez le nom d&apos;un produit ou d&apos;une marque dans la barre de
          recherche ci-dessus.
        </p>
      ) : results.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="text-muted">
            Aucun produit ne correspond à «&nbsp;{q}&nbsp;».
          </p>
          <p className="mt-2 text-sm text-muted">
            Essayez avec le nom d&apos;une marque (ex. « CeraVe », « Avène ») ou un
            type de soin (ex. « sérum », « solaire »).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
