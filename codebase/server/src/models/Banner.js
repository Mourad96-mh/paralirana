import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Bannière du carrousel d'accueil, gérée depuis l'admin. Le storefront statique
// lit un snapshot (lib/banners.data.json) baké au build, et le rafraîchit en
// direct depuis l'API dans le navigateur.
const BannerSchema = new Schema(
  {
    // Image large (~3:1) affichée sur desktop.
    image: { type: String, required: true },
    // Image carrée optionnelle pour mobile ; à défaut l'image desktop est utilisée.
    imageMobile: { type: String, default: '' },
    // Destination du clic : chemin interne (/solaire) ou URL complète.
    link: { type: String, default: '/' },
    // Texte superposé sur l'image (rendu en HTML par le site, pas baké dans
    // l'image) — même schéma que le hero du projet pour-bebe.
    tag: { type: String, default: '' },      // petite accroche au-dessus du titre
    title: { type: String, default: '' },    // titre principal de la diapositive
    subtitle: { type: String, default: '' }, // paragraphe sous le titre
    ctaText: { type: String, default: '' },  // libellé du bouton
    showCta: { type: Boolean, default: true },
    // Ordre d'affichage. Plus petit = plus tôt.
    order: { type: Number, default: 0 },
    // Une bannière inactive reste en base mais disparaît du carrousel.
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BannerSchema.index({ order: 1, createdAt: 1 });

export default mongoose.models.Banner || model('Banner', BannerSchema);
