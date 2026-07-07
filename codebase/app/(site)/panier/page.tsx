import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Votre panier Para Lirana — finalisez votre commande sur WhatsApp.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-green">
        Mon panier
      </h1>
      <CartView />
    </div>
  );
}
