export function formatMAD(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

// Single source of truth for the business phone number.
// Stored in local Moroccan format; helpers derive the tel:/wa.me forms.
export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE || "0664241035";

// Digits only, international (drop leading 0, prefix Morocco 212).
const phoneDigits = `212${PHONE_NUMBER.replace(/\D/g, "").replace(/^0/, "")}`;

// E.164 for tel: links, e.g. "+212664241035".
export const PHONE_TEL = `+${phoneDigits}`;

// Human-readable, e.g. "+212 6 64 24 10 35".
export const PHONE_DISPLAY = PHONE_TEL.replace(
  /^(\+212)(\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
  "$1 $2 $3 $4 $5 $6"
);

// WhatsApp uses the same number by default (wa.me wants digits only, no +).
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || phoneDigits;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://paralirana.com";

// Business address (single source of truth for display + JSON-LD).
export const ADDRESS_STREET =
  "61 avenue Lalla Yacout, angle Mustapha El Amani, 1er étage N°56, Centre Ria";
export const ADDRESS_CITY = "Casablanca";
export const ADDRESS_POSTAL = "20520";
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_CITY} ${ADDRESS_POSTAL}`;

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
