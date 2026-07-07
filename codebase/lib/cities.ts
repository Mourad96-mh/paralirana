// ---------------------------------------------------------------------------
// Para Lirana — city landing pages (local SEO)
//
// Moroccans search "parapharmacie {ville}" (e.g. parapharmacie casablanca ~2.9k/mo,
// quartiers like "maarif", and "grossiste parapharmacie casablanca"). Each city here
// renders /parapharmacie/{slug} with localized copy + delivery info. Add a city by
// appending an entry — the route and sitemap pick it up automatically.
// ---------------------------------------------------------------------------

export type City = {
  slug: string;
  name: string;
  // genitive/preposition-ready name used in copy ("à Casablanca")
  intro: string;
  // neighborhoods we explicitly mention for long-tail local intent
  districts: string[];
  // estimated delivery window shown to the user
  deliveryDelay: string;
};

export const cities: City[] = [
  {
    slug: "casablanca",
    name: "Casablanca",
    intro:
      "Faites-vous livrer vos marques de parapharmacie préférées partout à Casablanca, à prix discount et sans bouger de chez vous. La Roche-Posay, Avène, Bioderma, CeraVe, Eucerin, Vichy, Mustela… commandez en quelques clics sur WhatsApp.",
    districts: [
      "Maarif",
      "Gauthier",
      "Anfa",
      "Aïn Diab",
      "Bourgogne",
      "Sidi Maârouf",
      "Oulfa",
      "Ain Sebaâ",
      "Hay Hassani",
      "Californie",
    ],
    deliveryDelay: "24 à 48h",
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
