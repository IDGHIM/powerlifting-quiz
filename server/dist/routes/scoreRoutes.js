"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scoreModel_1 = require("../models/scoreModel");
const router = express_1.default.Router();
// POST /api/ranking — publier un ou plusieurs scores
router.post('/', async (req, res) => {
    try {
        const scores = Array.isArray(req.body) ? req.body : [req.body];
        const created = await scoreModel_1.Score.insertMany(scores.map(score => ({
            username: score.username,
            points: score.points,
            category: score.category,
            mode: score.mode,
        })));
        res.status(201).json(created);
    }
    catch (err) {
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
        const scores = await scoreModel_1.Score.find({ category, mode })
            .sort({ points: -1, createdAt: 1 }) // tri par score décroissant
            .limit(10); // top 10
        res.json(scores);
    }
    catch (err) {
        console.error('Erreur GET /api/ranking', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des scores' });
    }
});
exports.default = router;
