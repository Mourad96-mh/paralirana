import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  SITE_URL,
  PHONE_TEL,
  ADDRESS_STREET,
  ADDRESS_CITY,
  ADDRESS_POSTAL,
} from "@/lib/format";

// Public storefront shell — Navbar, Footer, floating WhatsApp button, and the
// site-wide LocalBusiness JSON-LD. Everything under (site) is customer-facing.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: "Para Lirana",
  description:
    "Parapharmacie en ligne au Maroc — soins visage, capillaire, solaire, bébé et compléments alimentaires.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  areaServed: "MA",
  currenciesAccepted: "MAD",
  telephone: PHONE_TEL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS_STREET,
    addressLocality: ADDRESS_CITY,
    postalCode: ADDRESS_POSTAL,
    addressCountry: "MA",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </CartProvider>
  );
}
