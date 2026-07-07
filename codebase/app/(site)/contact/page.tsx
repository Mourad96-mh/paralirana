import type { Metadata } from "next";
import { waLink, PHONE_TEL, PHONE_DISPLAY, ADDRESS_FULL } from "@/lib/format";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import PhoneIcon from "@/components/PhoneIcon";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Para Lirana pour toute question ou commande. WhatsApp, téléphone et horaires — parapharmacie en ligne au Maroc.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-green">Contact</h1>
      <p className="mt-2 max-w-xl text-muted">
        Une question sur un produit ou votre commande ? Écrivez-nous sur WhatsApp,
        c&apos;est le plus rapide. Notre équipe vous répond du lundi au samedi.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-black/5 bg-white p-6">
          <a
            href={waLink("Bonjour Para Lirana 🙂")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Discuter sur WhatsApp
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-green/30 px-4 py-3 font-semibold text-green hover:bg-green/5"
          >
            <PhoneIcon className="h-5 w-5" />
            Appeler : {PHONE_DISPLAY}
          </a>
          <div className="text-sm text-ink/80">
            <p className="font-semibold text-green">Horaires</p>
            <p>Lundi – Samedi : 9h – 19h</p>
          </div>
          <div className="text-sm text-ink/80">
            <p className="font-semibold text-green">Adresse</p>
            <p>{ADDRESS_FULL}</p>
          </div>
        </div>

        <form className="space-y-3 rounded-xl border border-black/5 bg-white p-6">
          <p className="text-sm text-muted">
            Ou laissez-nous un message (formulaire de démonstration) :
          </p>
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            type="tel"
            placeholder="Votre téléphone"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Votre message"
            rows={4}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-gold px-4 py-2.5 font-semibold text-white hover:bg-gold-dark"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
