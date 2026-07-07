// Seed catalog — the original v1 mock products, preserved so `npm run seed`
// can populate an empty database. Safe to edit; re-running seed upserts by slug.

export type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string; // Subcategory.slug within the parent category
  price: number;
  oldPrice?: number;
  image?: string; // path under /public (e.g. "/products/slug.png") or a full URL
  shortDescription: string;
  description: string;
  conseils?: string; // conseil d'utilisation
  composition?: string; // composition / ingrédients clés
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "la-roche-posay-effaclar-gel-moussant",
    image: "/products/la-roche-posay-effaclar-gel-moussant.png",
    subcategory: "nettoyants",
    conseils:
      "Appliquer matin et soir sur peau humide. Faire mousser en massant délicatement le visage, en évitant le contour des yeux, puis rincer abondamment à l'eau claire.",
    composition:
      "Formule sans savon à base d'eau thermale de La Roche-Posay, de Zinc PCA séborégulateur et de glycérine. Agents nettoyants doux respectant l'équilibre de la peau.",
    name: "Effaclar Gel Moussant Purifiant 400ml",
    brand: "La Roche-Posay",
    category: "visage",
    price: 149,
    oldPrice: 189,
    shortDescription: "Gel nettoyant purifiant pour peaux grasses à imperfections.",
    description:
      "Le gel moussant Effaclar nettoie la peau en douceur et élimine l'excès de sébum sans dessécher. Formulé pour les peaux grasses et sensibles à tendance acnéique, il laisse la peau nette et fraîche.",
    features: ["Peaux grasses à imperfections", "Sans savon", "Testé dermatologiquement", "400 ml"],
    rating: 4.7,
    reviews: 214,
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "cerave-creme-hydratante-visage",
    image: "/products/cerave-creme-hydratante-visage.png",
    subcategory: "hydratants",
    conseils:
      "Appliquer matin et/ou soir sur le visage et le cou nettoyés. S'utilise aussi comme base hydratante avant le maquillage.",
    composition:
      "3 céramides essentiels (1, 3, 6-II), acide hyaluronique et niacinamide, avec la technologie MVE de libération prolongée. Sans parfum, non comédogène.",
    name: "Crème Hydratante Visage 52ml",
    brand: "CeraVe",
    category: "visage",
    price: 119,
    shortDescription: "Hydratation 24h avec acide hyaluronique et céramides.",
    description:
      "Une crème hydratante légère qui restaure la barrière cutanée grâce à trois céramides essentiels et à l'acide hyaluronique. Convient aux peaux normales à sèches.",
    features: ["Acide hyaluronique", "3 céramides essentiels", "Non comédogène", "52 ml"],
    rating: 4.8,
    reviews: 167,
    inStock: true,
    isNew: true,
  },
  {
    slug: "bioderma-sensibio-h2o-eau-micellaire",
    image: "/products/bioderma-sensibio-h2o-eau-micellaire.png",
    subcategory: "nettoyants",
    conseils:
      "Imbiber un coton d'eau micellaire. Nettoyer et démaquiller le visage et les yeux matin et soir, sans rinçage. Renouveler jusqu'à ce que le coton reste propre.",
    composition:
      "Eau micellaire enrichie en esters d'acides gras (agents micellaires) et complexe breveté D.A.F. apaisant. Sans savon, sans alcool, sans parfum.",
    name: "Sensibio H2O Eau Micellaire 500ml",
    brand: "Bioderma",
    category: "visage",
    price: 169,
    oldPrice: 199,
    shortDescription: "L'eau micellaire iconique pour peaux sensibles.",
    description:
      "Sensibio H2O nettoie et démaquille en douceur tout en respectant l'équilibre de la peau sensible. Sans rinçage, elle apaise les sensations d'inconfort.",
    features: ["Peaux sensibles", "Démaquille yeux et visage", "Sans parfum", "500 ml"],
    rating: 4.9,
    reviews: 412,
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "the-ordinary-niacinamide-10-zinc",
    image: "/products/the-ordinary-niacinamide-10-zinc.png",
    subcategory: "serums",
    conseils:
      "Appliquer quelques gouttes sur le visage matin et soir, avant les crèmes, en évitant le contour des yeux. Le matin, faire suivre d'une protection solaire.",
    composition:
      "Niacinamide (vitamine B3) 10 % et Zinc PCA 1 %. Formule végane, sans huile ni alcool.",
    name: "Niacinamide 10% + Zinc 1% 30ml",
    brand: "The Ordinary",
    category: "visage",
    price: 99,
    shortDescription: "Sérum régulateur de sébum et anti-imperfections.",
    description:
      "Ce sérum concentré réduit l'apparence des imperfections et resserre les pores grâce à la niacinamide. Le zinc aide à réguler la production de sébum.",
    features: ["Régule le sébum", "Affine le grain de peau", "Végan", "30 ml"],
    rating: 4.5,
    reviews: 98,
    inStock: true,
  },
  {
    slug: "avene-cold-cream-corps",
    image: "/products/avene-cold-cream-corps.png",
    subcategory: "hydratants-corps",
    conseils:
      "Appliquer quotidiennement sur le corps, en insistant sur les zones sèches. Masser jusqu'à pénétration complète.",
    composition:
      "Eau thermale d'Avène apaisante, Cold Cream (cire d'abeille et huiles nourrissantes) et glycérine. Formule pour peaux sèches à très sèches.",
    name: "Cold Cream Lait Corps Nourrissant 400ml",
    brand: "Avène",
    category: "corps",
    price: 139,
    shortDescription: "Lait nourrissant pour peaux sèches à très sèches.",
    description:
      "Enrichi en Cold Cream, ce lait corps nourrit intensément et restaure le confort des peaux sèches. La texture fond rapidement sans effet collant.",
    features: ["Peaux sèches", "Nourrit 24h", "Eau thermale d'Avène", "400 ml"],
    rating: 4.6,
    reviews: 76,
    inStock: true,
  },
  {
    slug: "eucerin-ph5-baume-lavant",
    image: "/products/eucerin-ph5-baume-lavant.png",
    subcategory: "nettoyants-corps",
    conseils:
      "Appliquer sur peau humide, sous la douche ou au lavabo. Faire mousser puis rincer. Convient au visage et au corps, pour un usage quotidien.",
    composition:
      "Système pH5 Enzyme Protection, Dexpanthénol réparateur et agents lavants doux sans savon. Sans alcalis, sans colorant.",
    name: "pH5 Baume Lavant Peau Sensible 400ml",
    brand: "Eucerin",
    category: "corps",
    price: 129,
    oldPrice: 159,
    shortDescription: "Nettoyant doux qui renforce les peaux sensibles.",
    description:
      "Le baume lavant pH5 nettoie sans dessécher et renforce la résistance de la peau sensible. Sans savon ni colorant.",
    features: ["Peaux sensibles", "Sans savon", "pH physiologique", "400 ml"],
    rating: 4.7,
    reviews: 54,
    inStock: true,
  },
  {
    slug: "klorane-shampoing-ortie",
    image: "/products/klorane-shampoing-ortie.png",
    subcategory: "shampoings",
    conseils:
      "Appliquer sur cheveux mouillés, faire mousser en massant le cuir chevelu puis rincer. Renouveler si nécessaire. Idéal 2 à 3 fois par semaine.",
    composition:
      "Extrait d'ortie BIO séborégulateur et base lavante douce. 88 % d'ingrédients d'origine naturelle, sans sulfates. Flacon éco-conçu.",
    name: "Shampoing Séborégulateur à l'Ortie 400ml",
    brand: "Klorane",
    category: "capillaire",
    price: 89,
    shortDescription: "Pour cheveux gras, espace les shampoings.",
    description:
      "Le shampoing à l'ortie régule l'excès de sébum et laisse les cheveux légers et frais plus longtemps. Idéal pour cuirs chevelus à tendance grasse.",
    features: ["Cheveux gras", "Séborégulateur", "Usage fréquent", "400 ml"],
    rating: 4.4,
    reviews: 61,
    inStock: true,
  },
  {
    slug: "les-secrets-de-loly-leave-in",
    image: "/products/les-secrets-de-loly-leave-in.png",
    subcategory: "soins-cheveux",
    conseils:
      "Appliquer sur cheveux propres et humides, mèche par mèche, avant votre routine coiffante. Ne pas rincer, puis coiffer comme à l'habitude.",
    composition:
      "Soin sans rinçage enrichi en actifs hydratants (aloe vera, glycérine) et huiles végétales. Nourrit et définit les boucles des cheveux bouclés à crépus.",
    name: "Kalia Leave-In Hydratant 200ml",
    brand: "Les Secrets de Loly",
    category: "capillaire",
    price: 199,
    oldPrice: 229,
    shortDescription: "Soin sans rinçage pour cheveux bouclés et frisés.",
    description:
      "Un leave-in nourrissant qui hydrate, définit les boucles et facilite le coiffage des cheveux bouclés, frisés et crépus.",
    features: ["Cheveux bouclés à crépus", "Sans rinçage", "Définit les boucles", "200 ml"],
    rating: 4.8,
    reviews: 143,
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "phyto-phytophanere-complement-cheveux",
    image: "/products/phyto-phytophanere-complement-cheveux.png",
    subcategory: "complements-cheveux",
    conseils:
      "Prendre 2 capsules par jour avec un grand verre d'eau, de préférence le matin au petit-déjeuner. Cure de plusieurs mois, renouvelable.",
    composition:
      "Formule concentrée en zinc, biotine (B8), vitamines B5 et B6, levure de bière et huile de bourrache. Fortifie cheveux et ongles.",
    name: "Phytophanère Compléments Cheveux & Ongles",
    brand: "Phyto",
    category: "capillaire",
    price: 249,
    shortDescription: "Cure fortifiante cheveux et ongles, 120 capsules.",
    description:
      "Une cure de compléments alimentaires qui fortifie les cheveux et les ongles grâce aux vitamines B et aux acides gras essentiels.",
    features: ["Fortifie cheveux & ongles", "Cure 2 mois", "120 capsules"],
    rating: 4.5,
    reviews: 88,
    inStock: true,
  },
  {
    slug: "la-roche-posay-anthelios-spf50",
    image: "/products/la-roche-posay-anthelios-spf50.png",
    subcategory: "solaire-visage",
    conseils:
      "Appliquer généreusement sur le visage avant l'exposition. Renouveler toutes les 2 heures et après transpiration, baignade ou essuyage.",
    composition:
      "Filtres UVA/UVB dont Mexoryl 400 (protection des UVA ultra-longs), eau thermale de La Roche-Posay et antioxydants. Sans parfum, texture fluide invisible.",
    name: "Anthelios UVMune 400 Fluide SPF50+ 50ml",
    brand: "La Roche-Posay",
    category: "solaire",
    price: 219,
    oldPrice: 259,
    shortDescription: "Très haute protection visage, fini invisible.",
    description:
      "Protection solaire très haute SPF50+ contre les UVA ultra-longs. Texture fluide non grasse, idéale sous le maquillage.",
    features: ["SPF50+", "Visage", "Résistant à l'eau", "50 ml"],
    rating: 4.9,
    reviews: 201,
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "avene-spray-solaire-spf50-corps",
    image: "/products/avene-spray-solaire-spf50-corps.png",
    subcategory: "solaire-corps",
    conseils:
      "Bien agiter avant emploi. Vaporiser généreusement et uniformément sur le visage et le corps avant l'exposition. Renouveler fréquemment, surtout après la baignade.",
    composition:
      "Filtres haute protection UVB/UVA et eau thermale d'Avène apaisante. Texture invisible, résistante à l'eau, formule respectueuse du milieu marin.",
    name: "Spray Solaire Corps SPF50+ 200ml",
    brand: "Avène",
    category: "solaire",
    price: 199,
    shortDescription: "Protection corps haute tolérance, peaux sensibles.",
    description:
      "Un spray solaire très haute protection pour le corps, formulé pour les peaux sensibles. Application facile et uniforme.",
    features: ["SPF50+", "Corps", "Peaux sensibles", "200 ml"],
    rating: 4.6,
    reviews: 47,
    inStock: true,
  },
  {
    slug: "vichy-dermablend-fond-de-teint",
    image: "/products/vichy-dermablend-fond-de-teint.png",
    subcategory: "teint",
    conseils:
      "Appliquer sur peau propre, du centre du visage vers l'extérieur, aux doigts, au pinceau ou à l'éponge. Moduler la couvrance selon les besoins.",
    composition:
      "Haute concentration de pigments couvrants et eau thermale minéralisante de Vichy. Testé sur peaux sensibles, non comédogène.",
    name: "Dermablend Fond de Teint Correcteur 30ml",
    brand: "Vichy",
    category: "maquillage",
    price: 229,
    shortDescription: "Couvrance haute pour imperfections, 16h de tenue.",
    description:
      "Un fond de teint correcteur à couvrance modulable qui camoufle les imperfections et tient jusqu'à 16 heures. Testé sur peaux sensibles.",
    features: ["Haute couvrance", "16h de tenue", "Non comédogène", "30 ml"],
    rating: 4.5,
    reviews: 73,
    inStock: true,
  },
  {
    slug: "embryolisse-bb-cream",
    image: "/products/embryolisse-bb-cream.png",
    subcategory: "teint",
    conseils:
      "Appliquer une noisette sur le visage. S'utilise comme soin hydratant, base de maquillage, masque express ou lait démaquillant.",
    composition:
      "Lait-Crème multifonction à l'aloe vera, beurre de karité, huile de soja et cire d'abeille. Formule hydratante et protectrice.",
    name: "BB Crème Lait-Crème Concentré Teinté 30ml",
    brand: "Embryolisse",
    category: "maquillage",
    price: 159,
    oldPrice: 185,
    shortDescription: "Soin teinté hydratant 5-en-1.",
    description:
      "Une BB crème qui hydrate, unifie et illumine le teint en un seul geste. Idéale pour un effet bonne mine naturel.",
    features: ["Effet bonne mine", "Hydrate", "5-en-1", "30 ml"],
    rating: 4.4,
    reviews: 39,
    inStock: true,
    isNew: true,
  },
  {
    slug: "mustela-liniment-bebe",
    image: "/products/mustela-liniment-bebe.png",
    subcategory: "bebe",
    conseils:
      "À chaque change, nettoyer le siège de bébé à l'aide d'un coton imbibé de liniment. Ne pas rincer. Usage externe, dès la naissance.",
    composition:
      "Huile d'olive extra-vierge et eau de chaux. 98 % d'ingrédients d'origine naturelle, sans parfum ni conservateur.",
    name: "Liniment Change Bébé 400ml",
    brand: "Mustela",
    category: "bebe-maman",
    price: 109,
    shortDescription: "Nettoie et protège le siège de bébé à chaque change.",
    description:
      "Un liniment doux à base d'huile d'olive et d'eau de chaux qui nettoie la peau du siège tout en la protégeant des irritations.",
    features: ["Dès la naissance", "Nettoie & protège", "98% d'origine naturelle", "400 ml"],
    rating: 4.8,
    reviews: 132,
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "mustela-creme-vergetures-maman",
    image: "/products/mustela-creme-vergetures-maman.png",
    subcategory: "maman",
    conseils:
      "Appliquer matin et soir en massant délicatement le ventre, les hanches, les cuisses et la poitrine, dès le début de la grossesse et après l'accouchement. Éviter les cicatrices récentes.",
    composition:
      "Complexe breveté (avocat, arabinogalactane), beurre de karité et acide hyaluronique. Sans parfum, 97 % d'ingrédients d'origine naturelle.",
    name: "Crème Prévention Vergetures 150ml",
    brand: "Mustela",
    category: "bebe-maman",
    price: 189,
    shortDescription: "Prévient l'apparition des vergetures pendant la grossesse.",
    description:
      "Une crème qui améliore l'élasticité de la peau et aide à prévenir les vergetures pendant et après la grossesse.",
    features: ["Femmes enceintes", "Améliore l'élasticité", "Testée sous contrôle dermatologique", "150 ml"],
    rating: 4.6,
    reviews: 58,
    inStock: true,
  },
  {
    slug: "biocyte-collagene-marin",
    image: "/products/biocyte-collagene-marin.png",
    subcategory: "beaute",
    conseils:
      "Prendre les comprimés quotidiennement avec un grand verre d'eau, en cure d'un mois à renouveler de préférence.",
    composition:
      "Collagène marin hydrolysé, acide hyaluronique, coenzyme Q10 et niacinamide. Actifs anti-âge pour la fermeté de la peau.",
    name: "Collagène Marin Anti-Âge 90 comprimés",
    brand: "Biocyte",
    category: "complements-alimentaires",
    price: 299,
    oldPrice: 349,
    shortDescription: "Cure anti-âge peau, articulations et tonus.",
    description:
      "Une cure de collagène marin associé à l'acide hyaluronique et à la vitamine C pour soutenir la fermeté de la peau.",
    features: ["Anti-âge", "Collagène + vitamine C", "Cure 1 mois", "90 comprimés"],
    rating: 4.5,
    reviews: 110,
    inStock: true,
  },
  {
    slug: "nutergia-ergymag-magnesium",
    image: "/products/nutergia-ergymag-magnesium.png",
    subcategory: "vitalite",
    conseils:
      "Prendre 2 gélules par jour au cours d'un repas, avec un verre d'eau (éviter le thé et le café). Cure minimale de 30 jours, renouvelable.",
    composition:
      "4 formes de magnésium (citrate, carbonate, bisglycinate, marin), zinc et vitamines B1, B3, B5, B6. Formule désacidifiante.",
    name: "Ergymag Magnésium & Vitamines B 90 gélules",
    brand: "Nutergia",
    category: "complements-alimentaires",
    price: 179,
    shortDescription: "Réduit la fatigue, soutient le système nerveux.",
    description:
      "Une formule de magnésium hautement assimilable associée aux vitamines B pour aider à réduire la fatigue et le stress.",
    features: ["Anti-fatigue", "Magnésium + B6", "90 gélules"],
    rating: 4.7,
    reviews: 64,
    inStock: true,
  },
  {
    slug: "vitavea-vitamine-d3",
    image: "/products/vitavea-vitamine-d3.png",
    subcategory: "vitalite",
    conseils:
      "Prendre 1 comprimé par jour avec un grand verre d'eau, au moment du petit-déjeuner. Cure de 3 mois.",
    composition:
      "Vitamine D3 1000 UI par comprimé (500 % des VNR). Contribue à l'immunité, à la santé osseuse et à la fonction musculaire. Fabriqué en France.",
    name: "Vitamine D3 1000 UI 90 comprimés",
    brand: "Vitavea",
    category: "complements-alimentaires",
    price: 79,
    shortDescription: "Soutient l'immunité et la santé osseuse.",
    description:
      "Un apport quotidien en vitamine D3 pour contribuer au maintien d'une ossature normale et au bon fonctionnement du système immunitaire.",
    features: ["Immunité", "Os & dents", "90 comprimés"],
    rating: 4.6,
    reviews: 41,
    inStock: true,
    isNew: true,
  },
  {
    slug: "saforelle-soin-lavant-doux",
    image: "/products/saforelle-soin-lavant-doux.png",
    subcategory: "intime",
    conseils:
      "Utiliser comme un savon liquide pour la toilette intime et corporelle : faire mousser puis rincer à l'eau claire. Usage externe, quotidien.",
    composition:
      "Extrait de bardane apaisant et base lavante douce sans savon. Sans paraben ni colorant. Testé sous contrôle gynécologique.",
    name: "Soin Lavant Doux Hygiène Intime 250ml",
    brand: "Saforelle",
    category: "hygiene",
    price: 95,
    shortDescription: "Nettoyant doux apaisant pour l'hygiène intime quotidienne.",
    description:
      "Un soin lavant doux à la bardane qui apaise et protège les zones sensibles au quotidien. pH neutre.",
    features: ["Hygiène intime", "Apaisant", "Usage quotidien", "250 ml"],
    rating: 4.7,
    reviews: 87,
    inStock: true,
  },
  {
    slug: "cattier-dentifrice-bio",
    image: "/products/cattier-dentifrice-bio.png",
    subcategory: "bucco-dentaire",
    conseils:
      "Se brosser les dents après chaque repas, au moins deux fois par jour. Recracher, ne pas avaler.",
    composition:
      "Argile blanche reminéralisante et propolis, certifié BIO. Sans sulfates, sans fluor. Tube recyclable.",
    name: "Dentifrice Blancheur Bio 75ml",
    brand: "Cattier",
    category: "hygiene",
    price: 49,
    oldPrice: 65,
    shortDescription: "Dentifrice bio à l'argile blanche, effet blancheur.",
    description:
      "Un dentifrice certifié bio à l'argile blanche qui aide à retrouver la blancheur naturelle des dents tout en respectant l'émail.",
    features: ["Certifié bio", "Effet blancheur", "Sans fluor", "75 ml"],
    rating: 4.3,
    reviews: 33,
    inStock: true,
  },
];
