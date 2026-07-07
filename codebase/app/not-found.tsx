"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CatalogProvider } from "@/lib/catalog";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductFallback from "@/components/ProductFallback";

// Root 404 for the static export. Because unknown URLs on Hostinger are served
// this page (via ErrorDocument 404 → /404.html), we use it to render products that
// were added after the last build: if the path is /produit/<slug>, fetch it live.
// Otherwise, a normal 404. The URL check runs only on the client (window), so the
// baked 404.html stays a plain 404 and there's no hydration mismatch.
export default function NotFound() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const m = window.location.pathname.match(/^\/produit\/([^/]+)\/?$/);
    setSlug(m ? decodeURIComponent(m[1]) : "");
  }, []);

  if (slug) {
    return (
      <CatalogProvider>
        <CartProvider>
          <Navbar />
          <main>
            <ProductFallback slug={slug} />
          </main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </CatalogProvider>
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
