import { Router } from 'express';
import auth from '../middleware/auth.js';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';

const router = Router();

// POST /api/orders — PUBLIC : enregistre une commande WhatsApp depuis le panier.
// Les prix/total sont recalculés depuis la DB : un payload client trafiqué ne
// peut pas modifier ce qui est enregistré.
router.post('/', async (req, res, next) => {
  try {
    const { customer, items } = req.body || {};
    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ error: 'Nom et téléphone requis' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }

    const slugs = items.map((i) => i.slug).filter(Boolean);
    const dbProducts = await Product.find({ slug: { $in: slugs } })
      .select('slug name brand price image')
      .lean();
    const bySlug = new Map(dbProducts.map((p) => [p.slug, p]));

    const resolved = items.map((i) => {
      const match = i.slug ? bySlug.get(i.slug) : undefined;
      const qty = Math.max(1, Math.floor(Number(i.qty) || 1));
      return {
        productId: i.id,
        slug: i.slug,
        name: match?.name ?? i.name,
        brand: match?.brand ?? i.brand ?? '',
        image: match?.image ?? '',
        price: match?.price ?? 0,
        qty,
      };
    });

    const total = resolved.reduce((s, i) => s + i.price * i.qty, 0);

    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: customer.city?.trim() ?? '',
      },
      items: resolved,
      total,
    });

    res.status(201).json({ ok: true, id: String(order._id) });
  } catch (e) {
    next(e);
  }
});

// GET /api/orders — plus récent d'abord (protégé).
router.get('/', auth, async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/orders/:id — mettre à jour le statut (protégé).
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

export default router;
