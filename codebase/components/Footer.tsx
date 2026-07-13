import Link from "next/link";
import { cities } from "@/lib/cities";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import PhoneIcon from "@/components/PhoneIcon";
import FooterCategories from "@/components/FooterCategories";
import { PHONE_DISPLAY, ADDRESS_FULL } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-green text-white/80">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-mark.png"
                alt="Para Lirana"
                width={40}
                height={35}
                className="h-8 w-auto"
              />
            </span>
            <span className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-white">Para</span>
              <span className="font-display text-xl font-bold text-gold">Lirana</span>
            </span>
          </div>
          <p className="mt-3 text-sm">
            Votre parapharmacie en ligne au Maroc. Produits authentiques, prix
            discount, commande facile sur WhatsApp.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Catégories</h3>
          <FooterCategories />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Aide</h3>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/contact" className="hover:text-gold-light">Contact</Link></li>
            <li><Link href="/panier" className="hover:text-gold-light">Mon panier</Link></li>
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/parapharmacie/${c.slug}`}
                  className="hover:text-gold-light"
                >
                  Parapharmacie à {c.name}
                </Link>
              </li>
            ))}
            <li><span>À propos</span></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Contact</h3>
          <ul className="space-y-1.5 text-sm">
            <li>{ADDRESS_FULL}</li>
            <li>Lun–Sam : 9h – 19h</li>
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4" /> {PHONE_DISPLAY}
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" /> {PHONE_DISPLAY}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Para Lirana — Parapharmacie en ligne au Maroc. Tous droits réservés.
      </div>
    </footer>
  );
}
