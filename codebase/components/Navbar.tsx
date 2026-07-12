"use client";

import Link from "next/link";
import { useState } from "react";
import { useCategories } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import SearchBox from "@/components/SearchBox";

export default function Navbar() {
  const { count } = useCart();
  const { categories } = useCategories();
  const [open, setOpen] = useState(false); // mobile menu
  const [megaOpen, setMegaOpen] = useState(false); // desktop mega-menu

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/95 backdrop-blur">
      <div className="bg-green py-1.5 text-center text-xs text-white">
        Livraison partout au Maroc · Paiement à la livraison · Commande sur WhatsApp
      </div>

      {/* Row 1: logo · search · cart */}
      <div className="container flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt="Para Lirana"
            width={46}
            height={40}
            className="h-10 w-auto"
          />
          <span className="hidden items-baseline gap-1 sm:flex">
            <span className="font-display text-2xl font-bold text-green">Para</span>
            <span className="font-display text-2xl font-bold text-gold">Lirana</span>
          </span>
        </Link>

        {/* Search (desktop) — suggestions instantanées façon FiboSearch */}
        <div className="hidden flex-1 items-center md:flex md:max-w-xl">
          <SearchBox id="search-desktop" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/panier"
            aria-label={`Panier${count > 0 ? ` (${count} article${count > 1 ? "s" : ""})` : ""}`}
            className="relative rounded-lg bg-white p-2.5 text-green shadow-sm transition hover:text-green-dark hover:shadow"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm lg:hidden"
            aria-label={open ? "Fermer le menu" : "Menu"}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Search (mobile) — always visible at the top, not hidden in the burger */}
      <div className="container pb-3 md:hidden">
        <SearchBox id="search-mobile" />
      </div>

      {/* Row 2: category nav + mega-menu (desktop) */}
      <div className="hidden border-t border-black/5 bg-white lg:block">
        <div className="container flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-green"
              aria-expanded={megaOpen}
            >
              <span className="text-base leading-none">☰</span> Toutes les catégories
              <span className="text-xs">▾</span>
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-full z-50 w-[720px] max-w-[90vw] rounded-b-xl border border-black/5 bg-white p-5 shadow-lg">
                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {categories.map((c) => (
                    <div key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="flex items-center gap-2 text-sm font-semibold text-green hover:text-gold-dark"
                      >
                        <span>{c.icon}</span> {c.name}
                      </Link>
                      <ul className="mt-1.5 space-y-1">
                        {c.subcategories.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/${c.slug}?sub=${s.slug}`}
                              className="text-[13px] text-muted hover:text-gold-dark"
                            >
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick links */}
          <nav className="flex items-center gap-4 pl-2">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="text-sm font-medium text-ink hover:text-gold-dark"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu: search + categories with subcategories */}
      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="container py-3">
            <div className="divide-y divide-black/5">
              {categories.map((c) => (
                <details key={c.slug} className="py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-2 text-sm font-semibold text-green">
                    <Link
                      href={`/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="hover:text-gold-dark"
                    >
                      {c.icon} {c.name}
                    </Link>
                    <span className="text-gold">＋</span>
                  </summary>
                  <ul className="grid grid-cols-2 gap-1 px-1 pb-2">
                    {c.subcategories.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${c.slug}?sub=${s.slug}`}
                          onClick={() => setOpen(false)}
                          className="block rounded px-2 py-1 text-[13px] text-muted hover:bg-cream"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3l1.3-7.1H5.8" />
    </svg>
  );
}
