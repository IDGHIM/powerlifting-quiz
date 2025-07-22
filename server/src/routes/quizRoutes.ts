import express from 'express';
import { Question } from '../models/questionModel'

const router = express.Router();

router.get('/quiz', async (req, res) => {
  try {
    const rawCategory = req.query.category;
    if (!rawCategory || typeof rawCategory !== 'string') {
      return res.status(400).json({ error: 'Paramètre category requis' });
    }

    const category = rawCategory.trim().toLowerCase();
    const questions = await Question.find({ category: { $regex: `^${category}$`, $options: 'i' } });

    if (!questions.length) return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });

    res.json(questions);
  } catch (err) {
    console.error('Erreur /quiz :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
