// Seed — `npm run seed`. Upsert du catalogue (idempotent, clé = slug) et
// création du compte admin depuis ADMIN_EMAIL / ADMIN_PASSWORD si absent.
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product, { toDbProduct } from '../src/models/Product.js';
import Admin from '../src/models/Admin.js';
import { seedProducts } from './seed-data.mjs';

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
  for (const p of seedProducts) {
    const doc = toDbProduct(p);
    const existing = await Product.findOne({ slug: p.slug });
    if (existing) {
      await Product.updateOne({ slug: p.slug }, doc);
      updated++;
    } else {
      await Product.create(doc);
      created++;
    }
  }
  console.log(`✓ Produits : ${created} créés, ${updated} mis à jour`);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`• Admin ${email} existe déjà (inchangé)`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.create({ email, passwordHash });
      console.log(`✓ Admin créé : ${email}`);
    }
  } else {
    console.warn('! ADMIN_EMAIL / ADMIN_PASSWORD absents — aucun admin créé.');
  }

  await mongoose.disconnect();
  console.log('✓ Terminé');
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ Échec du seed :', err);
  process.exit(1);
});
