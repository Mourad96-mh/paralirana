import { Router } from 'express';
import auth from '../middleware/auth.js';
import Banner from '../models/Banner.js';

const router = Router();

// GET /api/banners — liste publique des bannières ACTIVES, triées par ordre.
// C'est ce que consomment le storefront et le sync de build : une bannière
// désactivée ne fuit jamais dans le snapshot statique.
router.get('/', async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json(banners);
  } catch (e) {
    next(e);
  }
});

// GET /api/banners/all — toutes les bannières, actives ou non (protégé).
// Chemin distinct plutôt que ?all=1 pour garder le middleware auth par route.
router.get('/all', auth, async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(banners);
  } catch (e) {
    next(e);
  }
});

// POST /api/banners — créer (protégé).
router.post('/', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.image || !String(body.image).trim()) {
      return res.status(400).json({ error: "L'image de la bannière est requise" });
    }
    const banner = await Banner.create({
      image: String(body.image).trim(),
      imageMobile: String(body.imageMobile || '').trim(),
      link: String(body.link || '').trim() || '/',
      title: String(body.title || '').trim(),
      order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
      active: body.active !== false,
    });
    res.status(201).json(banner.toObject());
  } catch (e) {
    next(e);
  }
});

// PUT /api/banners/:id — mettre à jour (protégé).
router.put('/:id', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const update = {};
    if (body.image != null) {
      const image = String(body.image).trim();
      if (!image) return res.status(400).json({ error: "L'image de la bannière est requise" });
      update.image = image;
    }
    if (body.imageMobile != null) update.imageMobile = String(body.imageMobile).trim();
    if (body.link != null) update.link = String(body.link).trim() || '/';
    if (body.title != null) update.title = String(body.title).trim();
    if (body.order != null && Number.isFinite(Number(body.order))) update.order = Number(body.order);
    if (body.active != null) update.active = body.active !== false;

    const banner = await Banner.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!banner) return res.status(404).json({ error: 'Bannière introuvable' });
    res.json(banner.toObject());
  } catch (e) {
    next(e);
  }
});

// DELETE /api/banners/:id — supprimer (protégé). Aucune dépendance à vérifier.
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Bannière introuvable' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
