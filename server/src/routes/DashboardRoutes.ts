import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/dashboard', authMiddleware, (req: Request, res: Response) => {
  const { username, role } = req.user!; // Le ! indique à TS que req.user est défini après le middleware
  res.json({ message: `Bienvenue ${username}, votre rôle est ${role}` });
});

export default router;
