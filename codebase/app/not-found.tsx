"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CatalogProvider } from "@/lib/catalog";
import { CategoriesProvider } from "@/lib/categories";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductFallback from "@/components/ProductFallback";
import CategoryFallback from "@/components/CategoryFallback";
import ScrollToTop from "@/components/ScrollToTop";

// Root 404 for the static export. Because unknown URLs on Hostinger are served
// this page (via ErrorDocument 404 → /404.html), we use it to render content that
// was added after the last build:
//   - /produit/<slug>  → a product added since the last build (ProductFallback)
//   - /<slug>          → a category created in the admin since the last build
//                        (CategoryFallback)
// Both look the content up live from the API by slug; if nothing matches, a normal
// 404. The URL check runs only on the client (window), so the baked 404.html stays
// a plain 404 and there's no hydration mismatch.
type Match =
  | { kind: "product"; slug: string }
  | { kind: "category"; slug: string }
  | { kind: "none" }
  | null;

export default function NotFound() {
  const [match, setMatch] = useState<Match>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const product = path.match(/^\/produit\/([^/]+)\/?$/);
    if (product) {
      setMatch({ kind: "product", slug: decodeURIComponent(product[1]) });
      return;
    }
    // A single URL segment that reached the 404 is a candidate category page —
    // real storefront routes (/panier, /contact, /recherche…) match their own
    // static pages and never land here.
    const category = path.match(/^\/([^/]+)\/?$/);
    if (category) {
      setMatch({ kind: "category", slug: decodeURIComponent(category[1]) });
      return;
    }
    setMatch({ kind: "none" });
  }, []);

  // Until the client resolves the URL, render nothing (matches the baked 404.html
  // shell so there's no flash of the plain 404 for a live product/category).
  if (!match) return null;

  if (match.kind === "product" || match.kind === "category") {
    return (
      <CategoriesProvider>
        <CatalogProvider>
          <CartProvider>
            <ScrollToTop />
            <Navbar />
            <main>
              {match.kind === "product" ? (
                <ProductFallback slug={match.slug} />
              ) : (
                <CategoryFallback slug={match.slug} />
              )}
            </main>
            <Footer />
            <WhatsAppFloat />
          </CartProvider>
        </CatalogProvider>
      </CategoriesProvider>
    );
  }

  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-5xl font-bold text-green">404</h1>
      <p className="text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-white hover:bg-gold-dark"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
