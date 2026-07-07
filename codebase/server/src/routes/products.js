import { Router } from 'express';
import auth from '../middleware/auth.js';
import Product, { toDbProduct, fromDbProduct } from '../models/Product.js';
import { slugify } from '../lib/slug.js';

const router = Router();

// GET /api/products — catalogue complet (public), plus récent d'abord.
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products.map(fromDbProduct));
  } catch (e) {
    next(e);
  }
});

// GET /api/products/:slug — un produit par slug (public).
router.get('/:slug', async (req, res, next) => {
  try {
    const doc = await Product.findOne({ slug: req.params.slug }).lean();
    if (!doc) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(fromDbProduct(doc));
  } catch (e) {
    next(e);
  }
});

// POST /api/products — créer (protégé).
router.post('/', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.brand || !body.category || body.price == null) {
      return res.status(400).json({ error: 'Nom, marque, catégorie et prix sont requis' });
    }
    const slug = (body.slug && slugify(body.slug)) || slugify(body.name);
    const exists = await Product.findOne({ slug });
    if (exists) {
      return res.status(409).json({ error: `Un produit avec le slug « ${slug} » existe déjà` });
    }
    const product = await Product.create(toDbProduct({ ...body, slug }));
    res.status(201).json(fromDbProduct(product.toObject()));
  } catch (e) {
    next(e);
  }
});

// PUT /api/products/:id — mettre à jour (protégé).
router.put('/:id', auth, async (req, res, next) => {
  try {
    const body = { ...(req.body || {}) };
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ error: 'Produit introuvable' });

    if (body.slug || body.name) {
      const nextSlug = body.slug ? slugify(body.slug) : slugify(body.name);
      if (nextSlug && nextSlug !== current.slug) {
        const clash = await Product.findOne({ slug: nextSlug });
        if (clash) return res.status(409).json({ error: `Le slug « ${nextSlug} » est déjà pris` });
        body.slug = nextSlug;
      } else {
        delete body.slug;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, toDbProduct(body), {
      new: true,
      runValidators: true,
    });
    res.json(product ? fromDbProduct(product.toObject()) : null);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/products/:id — supprimer (protégé).
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
