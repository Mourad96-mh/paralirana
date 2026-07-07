import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import cloudinary, { CLOUDINARY_CONFIGURED } from '../config/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

// POST /api/uploads — form-data avec un champ `file` (protégé). Renvoie { url }.
// Si Cloudinary n'est pas configuré, renvoie 501 → l'admin colle une URL à la place.
router.post('/', auth, upload.single('file'), async (req, res, next) => {
  if (!CLOUDINARY_CONFIGURED) {
    return res
      .status(501)
      .json({ error: "Cloudinary non configuré — collez une URL d'image à la place." });
  }
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'paralirana/products',
      resource_type: 'image',
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    next(e);
  }
});

export default router;
