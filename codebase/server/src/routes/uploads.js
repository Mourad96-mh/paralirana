import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import cloudinary, { CLOUDINARY_CONFIGURED } from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// Dossiers Cloudinary autorisés ; tout autre valeur retombe sur products.
const ALLOWED_FOLDERS = ['paralirana/products', 'paralirana/banners'];

// POST /api/uploads — form-data avec un champ `file` et un champ optionnel
// `folder` (protégé). Renvoie { url }.
// Si Cloudinary n'est pas configuré, renvoie 501 → l'admin colle une URL à la place.
router.post('/', auth, upload.single('file'), async (req, res, next) => {
  if (!CLOUDINARY_CONFIGURED) {
    return res
      .status(501)
      .json({ error: "Cloudinary non configuré — collez une URL d'image à la place." });
  }
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
    const folder = ALLOWED_FOLDERS.includes(req.body && req.body.folder)
      ? req.body.folder
      : 'paralirana/products';
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    next(e);
  }
});

export default router;
