import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SearchClient from "./SearchClient";

// Static page (noindex). The query-dependent results are rendered client-side by
// SearchClient (reads ?q= via useSearchParams) so the page can be statically exported.
export const metadata: Metadata = {
  title: "Recherche — Para Lirana",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Accueil
        </Link>{" "}
        / <span className="text-ink">Recherche</span>
      </nav>

      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
