// Seed script — run with `npm run seed`.
// Loads .env.local, upserts the seed catalog (idempotent, keyed by slug), and
// creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD if missing.

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { seedProducts } from "./seed-data";
import ProductModel, { toDbProduct } from "../models/Product";
import AdminModel from "../models/Admin";

// Next.js reads .env.local; load it first, then fall back to .env.
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI manquant. Renseignez .env.local (voir .env.example).");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✓ Connecté à MongoDB");

  // --- Products (upsert by slug) ---
  let created = 0;
  let updated = 0;
  for (const p of seedProducts) {
    const doc = toDbProduct(p as unknown as Record<string, unknown>);
    const existing = await ProductModel.findOne({ slug: p.slug });
    if (existing) {
      await ProductModel.updateOne({ slug: p.slug }, doc);
      updated++;
    } else {
      await ProductModel.create(doc);
      created++;
    }
  }
  console.log(`✓ Produits : ${created} créés, ${updated} mis à jour`);

  // --- Admin ---
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await AdminModel.findOne({ email });
    if (existing) {
      console.log(`• Admin ${email} existe déjà (inchangé)`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await AdminModel.create({ email, passwordHash });
      console.log(`✓ Admin créé : ${email}`);
    }
  } else {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD absents — aucun admin créé.");
  }

  await mongoose.disconnect();
  console.log("✓ Terminé");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Échec du seed :", err);
  process.exit(1);
});
