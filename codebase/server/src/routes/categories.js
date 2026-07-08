import { Router } from 'express';
import auth from '../middleware/auth.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify } from '../lib/slug.js';

const router = Router();

// Normalise une liste de sous-catégories (chaînes ou objets {slug,name}) en
// { slug, name } avec slug dérivé du nom si absent.
function normalizeSubs(subs) {
  if (!Array.isArray(subs)) return [];
  const seen = new Set();
  const out = [];
  for (const s of subs) {
    const name = (typeof s === 'string' ? s : s && s.name) || '';
    if (!name.trim()) continue;
    const slug = (s && s.slug && slugify(s.slug)) || slugify(name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, name: name.trim() });
  }
  return out;
}

// GET /api/categories — liste publique, triée par ordre puis nom.
router.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ order: 1, name: 1 }).lean();
    res.json(cats);
  } catch (e) {
    next(e);
  }
});

// POST /api/categories — créer (protégé).
router.post('/', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !String(body.name).trim()) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }
    const slug = (body.slug && slugify(body.slug)) || slugify(body.name);
    if (!slug) return res.status(400).json({ error: 'Nom de catégorie invalide' });
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(409).json({ error: `Une catégorie « ${slug} » existe déjà` });
    }
    const cat = await Category.create({
      slug,
      name: String(body.name).trim(),
      tagline: String(body.tagline || '').trim(),
      icon: String(body.icon || '').trim() || '🏷️',
      image: body.image ? String(body.image).trim() : undefined,
      subcategories: normalizeSubs(body.subcategories),
      order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
    });
    res.status(201).json(cat.toObject());
  } catch (e) {
    next(e);
  }
});

// PUT /api/categories/:id — mettre à jour (protégé). Un changement de slug est
// répercuté sur les produits liés pour ne pas les orphaniser.
router.put('/:id', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const current = await Category.findById(req.params.id);
    if (!current) return res.status(404).json({ error: 'Catégorie introuvable' });

    const update = {};
    if (body.name != null) update.name = String(body.name).trim();
    if (body.tagline != null) update.tagline = String(body.tagline).trim();
    if (body.icon != null) update.icon = String(body.icon).trim() || '🏷️';
    if (body.image != null) update.image = String(body.image).trim() || undefined;
    if (body.subcategories != null) update.subcategories = normalizeSubs(body.subcategories);
    if (body.order != null && Number.isFinite(Number(body.order))) update.order = Number(body.order);

    if (body.slug || body.name) {
      const nextSlug = body.slug ? slugify(body.slug) : slugify(body.name);
      if (nextSlug && nextSlug !== current.slug) {
        const clash = await Category.findOne({ slug: nextSlug });
        if (clash) return res.status(409).json({ error: `Le slug « ${nextSlug} » est déjà pris` });
        update.slug = nextSlug;
      }
    }

    const cat = await Category.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (update.slug && update.slug !== current.slug) {
      await Product.updateMany({ category: current.slug }, { category: update.slug });
    }
    res.json(cat ? cat.toObject() : null);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/categories/:id — supprimer (protégé). Refusé si des produits l'utilisent.
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Catégorie introuvable' });
    const count = await Product.countDocuments({ category: cat.slug });
    if (count > 0) {
      return res.status(409).json({
        error: `Impossible de supprimer : ${count} produit(s) utilisent cette catégorie. Réaffectez-les d'abord.`,
      });
    }
    await cat.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
