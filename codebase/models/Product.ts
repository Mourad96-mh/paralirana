import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

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
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    conseils: { type: String, default: "" },
    composition: { type: String, default: "" },
    features: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    // Stored as `newArrival`, NOT `isNew`: `isNew` is a reserved Mongoose
    // document flag (it tracks insert-vs-update on .save()). A schema path named
    // `isNew` silently breaks inserts — creating a doc with `isNew:false` makes
    // Mongoose treat the save as an update and persist nothing. We translate
    // to/from the app-facing `isNew` at every DB boundary (see helpers below).
    newArrival: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound/sort indexes for the common access patterns: filtered category
// listings (category + price), the featured query, and newest-first sorts.
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isBestseller: 1, newArrival: 1 });
ProductSchema.index({ createdAt: -1 });

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

// --- app <-> DB field translation for the reserved `isNew` key ---------------

// App/payload shape (`isNew`) → DB shape (`newArrival`). Use on every write.
export function toDbProduct<T extends Record<string, unknown>>(input: T) {
  if (!input || !("isNew" in input)) return input;
  const { isNew, ...rest } = input as Record<string, unknown>;
  return { ...rest, newArrival: isNew };
}

// DB shape (`newArrival`) → app shape (`isNew`). Use on raw docs sent to clients.
export function fromDbProduct<T extends Record<string, unknown>>(doc: T) {
  if (!doc || !("newArrival" in doc)) return doc;
  const { newArrival, ...rest } = doc as Record<string, unknown>;
  return { ...rest, isNew: newArrival ?? false };
}

export default models.Product || model("Product", ProductSchema);
