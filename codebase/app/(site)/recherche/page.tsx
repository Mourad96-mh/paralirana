import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";

// Search results depend on the query → always dynamic, and kept out of the index.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche — Para Lirana",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        / <span className="text-ink">Recherche</span>
      </nav>

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
    </div>
  );
}
