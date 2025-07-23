import express from 'express';
import { Score } from '../models/scoreModel';

const router = express.Router();

// POST /api/ranking — publier un ou plusieurs scores
router.post('/', async (req, res) => {
  try {
    const scores = Array.isArray(req.body) ? req.body : [req.body];

    const created = await Score.insertMany(scores.map(score => ({
      username: score.username,
      points: score.points,
      category: score.category,
      mode: score.mode,
    })));

    res.status(201).json(created);
  } catch (err) {
    console.error('Erreur POST /api/ranking', err);
    res.status(500).json({ error: 'Erreur lors de la publication du score.' });
  }
});

// GET /api/ranking?category=...&mode=...
router.get('/', async (req, res) => {
  const { category, mode } = req.query;

  if (!category || !mode) {
    return res.status(400).json({ error: 'Les paramètres "category" et "mode" sont requis' });
  }

  try {
    const scores = await Score.find({ category, mode })
      .sort({ points: -1, createdAt: 1 }) // tri par score décroissant
      .limit(10); // top 10

    res.json(scores);
  } catch (err) {
    console.error('Erreur GET /api/ranking', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des scores' });
  }
});

export default router;
