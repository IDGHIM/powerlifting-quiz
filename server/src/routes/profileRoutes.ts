import express from 'express';
import jwt from 'jsonwebtoken';
import { getProfile, createProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

// Middleware d'authentification
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

router.use(authenticate);

router.get('/:username', getProfile);
router.post('/', createProfile);
router.put('/:id', updateProfile);

export default router;