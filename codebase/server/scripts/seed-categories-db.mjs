// Seed UNIQUEMENT les catégories (idempotent, clé = slug) — sans toucher aux
// produits ni à l'admin. Utile pour peupler la collection `categories` sur une
// base déjà en production sans écraser les produits édités.
//   npm run seed:categories   (dans codebase/server)
import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../src/models/Category.js';
import { seedCategories } from './seed-categories.mjs';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('✗ MONGODB_URI manquant. Renseignez .env (voir .env.example).');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✓ Connecté à MongoDB');

  let created = 0;
  let updated = 0;
  for (const c of seedCategories) {
    const existing = await Category.findOne({ slug: c.slug });
    if (existing) {
      await Category.updateOne({ slug: c.slug }, c);
      updated++;
    } else {
      await Category.create(c);
      created++;
    }
  }
  console.log(`✓ Catégories : ${created} créées, ${updated} mises à jour`);

  await mongoose.disconnect();
  console.log('✓ Terminé');
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ Échec du seed des catégories :', err);
  process.exit(1);
});
