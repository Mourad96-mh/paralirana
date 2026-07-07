import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    image: { type: String },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    conseils: { type: String, default: '' },
    composition: { type: String, default: '' },
    features: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    // Stocké sous `newArrival`, PAS `isNew` : `isNew` est un drapeau réservé de
    // Mongoose (insert vs update). On traduit vers/depuis `isNew` à chaque
    // frontière DB via les helpers ci-dessous.
    newArrival: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isBestseller: 1, newArrival: 1 });
ProductSchema.index({ createdAt: -1 });

// Payload app (`isNew`) → forme DB (`newArrival`). À utiliser sur chaque écriture.
export function toDbProduct(input) {
  if (!input || !('isNew' in input)) return input;
  const { isNew, ...rest } = input;
  return { ...rest, newArrival: isNew };
}

// Forme DB (`newArrival`) → forme app (`isNew`). À utiliser sur chaque lecture renvoyée.
export function fromDbProduct(doc) {
  if (!doc || !('newArrival' in doc)) return doc;
  const { newArrival, ...rest } = doc;
  return { ...rest, isNew: newArrival ?? false };
}

export default mongoose.models.Product || model('Product', ProductSchema);
