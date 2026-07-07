// ---------------------------------------------------------------------------
// Para Lirana — brands: the featured list (brand wall + brand hub pages) plus
// per-brand SEO content. Client-safe (no DB import).
//
// Moroccan parapharmacy demand is largely brand-driven (see
// research/keyword-analysis.md: Eucerin, SVR, Vichy, Bioderma, Uriage, Nuxe,
// La Roche-Posay… drive thousands of searches/mo). Each brand renders a
// `/marque/{slug}` hub: keyword H1 + brand story + product grid + buying guide
// + FAQ, richer than competitors (who mostly ship a thin intro + grid).
// ---------------------------------------------------------------------------

export type Brand = { slug: string; name: string };

export type BrandContent = {
  // SEO subtitle shown under the H1
  tagline: string;
  // brand story — indexable paragraphs
  intro: string[];
  // "bien choisir" buying guide: product line / concern → advice
  guide: { title: string; text: string }[];
  // per-brand FAQ (feeds FAQPage JSON-LD)
  faqs: { q: string; a: string }[];
};

export const featuredBrands: Brand[] = [
  { slug: "la-roche-posay", name: "La Roche-Posay" },
  { slug: "avene", name: "Avène" },
  { slug: "bioderma", name: "Bioderma" },
  { slug: "eucerin", name: "Eucerin" },
  { slug: "vichy", name: "Vichy" },
  { slug: "cerave", name: "CeraVe" },
  { slug: "uriage", name: "Uriage" },
  { slug: "svr", name: "SVR" },
  { slug: "nuxe", name: "Nuxe" },
  { slug: "filorga", name: "Filorga" },
  { slug: "novexpert", name: "Novexpert" },
  { slug: "ducray", name: "Ducray" },
  { slug: "klorane", name: "Klorane" },
  { slug: "phyto", name: "Phyto" },
  { slug: "mustela", name: "Mustela" },
  { slug: "isdin", name: "ISDIN" },
  { slug: "lierac", name: "Lierac" },
  { slug: "embryolisse", name: "Embryolisse" },
];

// Fully-written brand pages. Brands not listed here fall back to generic copy
// generated from the brand name (still unique per URL, upgraded over time).
export const brandContent: Record<string, BrandContent> = {
  eucerin: {
    tagline: "Dermocosmétique médicale allemande, recommandée par les dermatologues",
    intro: [
      "Née dans un laboratoire pharmaceutique allemand il y a plus d'un siècle, Eucerin est aujourd'hui l'une des marques de dermocosmétique les plus recommandées par les dermatologues à travers le monde. Ses formules, développées sur la base de la recherche scientifique, ciblent des problématiques de peau exigeantes : sécheresse intense, imperfections et acné, taches brunes, signes de l'âge ou peaux atopiques.",
      "Chez Para Lirana, retrouvez les gammes Eucerin les plus recherchées au Maroc — Hyaluron-Filler, DermoPure, Sun Protection, UreaRepair et Anti-Pigment — à prix discount, 100% authentiques, avec commande sur WhatsApp et livraison partout au Royaume. Un écran solaire Eucerin, un sérum anti-âge ou une crème pour peau très sèche : vous commandez en quelques clics et vous payez à la livraison.",
    ],
    guide: [
      {
        title: "Hyaluron-Filler — rides & anti-âge",
        text: "À base d'acide hyaluronique, cette gamme comble visiblement les rides et repulpe la peau. Idéale à partir de 30 ans pour prévenir et corriger les signes de l'âge.",
      },
      {
        title: "DermoPure — peaux à imperfections",
        text: "Pensée pour les peaux grasses et acnéiques : elle réduit les imperfections, resserre les pores et matifie sans dessécher.",
      },
      {
        title: "Sun — écran solaire SPF 50+",
        text: "Les écrans solaires Eucerin (dont le célèbre « écran Eucerin ») protègent visage et corps des UV et de la lumière visible, y compris les peaux sensibles ou sujettes aux taches.",
      },
      {
        title: "UreaRepair — peaux très sèches",
        text: "Enrichie en urée, elle réhydrate durablement les peaux très sèches à tendance atopique, du visage aux pieds.",
      },
      {
        title: "Anti-Pigment — taches brunes",
        text: "Une gamme ciblée qui atténue les taches pigmentaires et unifie le teint, à associer à une protection solaire quotidienne.",
      },
    ],
    faqs: [
      {
        q: "Les produits Eucerin conviennent-ils aux peaux sensibles ?",
        a: "Oui. La majorité des soins Eucerin sont formulés et testés pour les peaux sensibles et réactives, sans parfum inutile. Vérifiez toujours la gamme correspondant à votre type de peau (sèche, grasse, atopique).",
      },
      {
        q: "Quel écran solaire Eucerin choisir ?",
        a: "Pour une protection maximale au Maroc, optez pour un SPF 50+. Les peaux à imperfections préféreront une texture fluide/matifiante, les peaux sujettes aux taches la gamme Sun Anti-Pigment.",
      },
      {
        q: "Où acheter Eucerin au Maroc au meilleur prix ?",
        a: "Sur Para Lirana : produits Eucerin authentiques à prix discount, commande sur WhatsApp et livraison partout au Maroc avec paiement à la livraison.",
      },
      {
        q: "Les produits Eucerin vendus sont-ils authentiques ?",
        a: "Oui, à 100%. Nous ne commercialisons que des produits d'origine issus des circuits officiels de la marque.",
      },
    ],
  },
};

export function getBrand(slug: string): Brand | undefined {
  return featuredBrands.find((b) => b.slug === slug);
}

// Generic, still-unique fallback content for brands not yet fully written.
function genericBrandContent(name: string): BrandContent {
  return {
    tagline: `Vos soins ${name} au meilleur prix au Maroc`,
    intro: [
      `Découvrez la sélection ${name} de Para Lirana : des produits de parapharmacie authentiques, plébiscités par les dermatologues et les pharmaciens, à prix discount.`,
      `Soins du visage, du corps, solaires ou compléments : commandez vos produits ${name} en quelques clics sur WhatsApp et faites-vous livrer partout au Maroc, avec paiement à la livraison.`,
    ],
    guide: [
      {
        title: "Soins du visage",
        text: `Nettoyants, sérums et crèmes ${name} adaptés à chaque type de peau — sèche, grasse, mixte ou sensible.`,
      },
      {
        title: "Soins du corps",
        text: `Hydratation et soins ciblés ${name} pour prendre soin de votre peau au quotidien.`,
      },
      {
        title: "Protection solaire",
        text: `Écrans solaires ${name} pour protéger votre peau du soleil marocain toute l'année.`,
      },
    ],
    faqs: [
      {
        q: `Les produits ${name} sont-ils authentiques ?`,
        a: `Oui, à 100%. Para Lirana ne vend que des produits ${name} d'origine, issus des circuits officiels.`,
      },
      {
        q: `Où acheter ${name} au Maroc au meilleur prix ?`,
        a: `Sur Para Lirana : ${name} à prix discount, commande sur WhatsApp et livraison partout au Maroc.`,
      },
      {
        q: "Comment passer commande et payer ?",
        a: "Ajoutez vos produits au panier, validez, et confirmez sur WhatsApp. Le paiement se fait à la livraison.",
      },
    ],
  };
}

export function getBrandContent(brand: Brand): BrandContent {
  return brandContent[brand.slug] ?? genericBrandContent(brand.name);
}
