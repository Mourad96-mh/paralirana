import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = Router();

// POST /api/auth/login → { token }
router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password || '';
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const admin = await Admin.findOne({ email });
    const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign(
      { sub: String(admin._id), email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, email });
  } catch (e) {
    next(e);
  }
});

export default router;
