import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/format";

// Self-hosted, optimized Google Font (no render-blocking external request,
// `display: swap` avoids invisible text). Exposed as a CSS var used by Tailwind.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Root layout: the minimal shared shell (html/body + fonts). Public chrome
// (Navbar/Footer/cart) lives in app/(site)/layout.tsx; the admin has its own
// chrome in app/admin/layout.tsx — so neither leaks into the other.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Para Lirana — Parapharmacie en ligne au Maroc | Prix discount",
    template: "%s | Para Lirana",
  },
  description:
    "Parapharmacie en ligne au Maroc : soins visage, capillaire, solaire, bébé et compléments alimentaires des plus grandes marques. Prix discount, commande sur WhatsApp, livraison partout au Maroc.",
  robots: { index: true, follow: true },
  // Google Search Console ownership verification for paralirana.com.
  verification: { google: "PD6r_eHNWqu7JM7S_36PtbbKXcVLnmTuHnfxl8N4pr0" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
