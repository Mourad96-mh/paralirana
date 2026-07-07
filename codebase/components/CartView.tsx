"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import { cities } from "@/lib/cities";
import { formatMAD, waLink } from "@/lib/format";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function CartView() {
  const { items, total, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center">
        <p className="text-lg font-medium text-green">Votre panier est vide</p>
        <p className="mt-1 text-sm text-muted">
          Parcourez nos catégories et ajoutez vos produits préférés.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-lg bg-gold px-5 py-2.5 font-semibold text-white hover:bg-gold-dark"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  async function order() {
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Merci d'indiquer votre nom et votre téléphone.");
      return;
    }
    setSubmitting(true);
    const message = buildOrderMessage(items, total, name.trim(), city.trim());
    const API = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      // Persist the order first (best-effort — never block the sale on it).
      await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: phone.trim(), city: city.trim() },
          items: items.map((i) => ({
            id: i.id,
            slug: i.slug,
            name: i.name,
            brand: i.brand,
            qty: i.qty,
          })),
        }),
      }).catch((e) => console.error("order persist failed", e));
    } finally {
      clear();
      // Navigate to WhatsApp with the pre-filled message.
      window.location.href = waLink(message);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-4"
          >
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wide text-muted">
                {i.brand}
              </p>
              <Link
                href={`/produit/${i.slug}`}
                className="text-sm font-medium text-ink hover:text-gold-dark"
              >
                {i.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-green">
                {formatMAD(i.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(i.id, i.qty - 1)}
                className="h-8 w-8 rounded-lg border border-black/10 text-lg leading-none"
                aria-label="Réduire"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{i.qty}</span>
              <button
                onClick={() => setQty(i.id, i.qty + 1)}
                className="h-8 w-8 rounded-lg border border-black/10 text-lg leading-none"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>

            <button
              onClick={() => remove(i.id)}
              className="text-sm text-muted hover:text-red-500"
              aria-label="Retirer"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={clear}
          className="text-sm text-muted underline hover:text-red-500"
        >
          Vider le panier
        </button>
      </div>

      {/* Summary + checkout */}
      <aside className="h-fit space-y-4 rounded-xl border border-black/5 bg-white p-5 lg:sticky lg:top-28">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Sous-total</span>
          <span className="font-semibold">{formatMAD(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Livraison</span>
          <span className="text-muted">À confirmer</span>
        </div>
        <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-bold text-green">
          <span>Total</span>
          <span>{formatMAD(total)}</span>
        </div>

        <div className="space-y-2 border-t border-black/5 pt-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom *"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Votre téléphone *"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <input
            list="paralirana-cities"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Votre ville"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <datalist id="paralirana-cities">
            {cities.map((c) => (
              <option key={c.slug} value={c.name} />
            ))}
          </datalist>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={order}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-60"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {submitting ? "Ouverture de WhatsApp…" : "Commander sur WhatsApp"}
        </button>
        <p className="text-center text-xs text-muted">
          Vous finalisez votre commande et l&apos;adresse de livraison directement
          avec notre équipe sur WhatsApp.
        </p>
      </aside>
    </div>
  );
}

function buildOrderMessage(
  items: CartItem[],
  total: number,
  name: string,
  city: string
): string {
  const lines = items.map(
    (i) => `• ${i.qty} × ${i.brand} — ${i.name} (${formatMAD(i.price)})`
  );
  return [
    "Bonjour Para Lirana, je souhaite commander :",
    "",
    ...lines,
    "",
    `Total : ${formatMAD(total)}`,
    "",
    `Nom : ${name}`,
    ...(city ? [`Ville : ${city}`] : []),
    "",
    "Merci de me confirmer la disponibilité et les frais de livraison.",
  ].join("\n");
}
