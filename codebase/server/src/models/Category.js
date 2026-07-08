import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Sous-catégorie : slug unique au sein de sa catégorie parente + libellé affiché.
const SubcategorySchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

// Catégorie du catalogue. Auparavant codée en dur dans lib/products.ts ; désormais
// gérable depuis l'admin. Le storefront statique lit un snapshot (lib/categories.data.json)
// baké au build, et le rafraîchit en direct depuis l'API dans le navigateur.
const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    icon: { type: String, default: '🏷️' },
    image: { type: String },
    subcategories: { type: [SubcategorySchema], default: [] },
    // Ordre d'affichage (menu, footer). Plus petit = plus tôt.
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1, name: 1 });

export default mongoose.models.Category || model('Category', CategorySchema);
