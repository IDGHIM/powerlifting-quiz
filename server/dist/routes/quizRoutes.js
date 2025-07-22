"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionModel_1 = require("../models/questionModel");
const router = express_1.default.Router();
router.get('/quiz', async (req, res) => {
    try {
        const rawCategory = req.query.category;
        if (!rawCategory || typeof rawCategory !== 'string') {
            return res.status(400).json({ error: 'Paramètre category requis' });
        }
        const category = rawCategory.trim().toLowerCase();
        const questions = await questionModel_1.Question.find({ category: { $regex: `^${category}$`, $options: 'i' } });
        if (!questions.length)
            return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });
        res.json(questions);
    }
    catch (err) {
        console.error('Erreur /quiz :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
