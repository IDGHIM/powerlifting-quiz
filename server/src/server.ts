import express from 'express';
import cors from 'cors';
import mongoose, { Document, Model } from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Interface TypeScript
interface IQuestion extends Document {
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Schéma Mongoose
const questionSchema = new mongoose.Schema<IQuestion>({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
});

const QuestionModel: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

// Connexion MongoDB
mongoose
  .connect('mongodb://localhost:27017/quizdb')
  .then(() => {
    console.log('✅ MongoDB connecté');
  })
  .catch((err) => {
    console.error('❌ Erreur connexion MongoDB', err);
  });

// Endpoint API pour récupérer les questions d'une catégorie
app.get('/api/quiz', async (req, res) => {
  const rawCategory = req.query.category;

  if (!rawCategory || typeof rawCategory !== 'string') {
    return res.status(400).json({ error: 'Paramètre category requis' });
  }

  const category = rawCategory.trim().toLowerCase(); // normalisation

  console.log(`🔍 Recherche catégorie : '${category}'`);

  try {
    // Pour debug : liste des catégories présentes
    const allCategories = await QuestionModel.distinct('category');
    console.log('📚 Catégories disponibles en base :', allCategories);

    // Recherche stricte insensible à la casse
    const questions = await QuestionModel.find({
      category: { $regex: `^${category}$`, $options: 'i' },
    });

    console.log(`✅ Questions trouvées pour ${category} :`, questions.length);

    if (!questions.length) {
      return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });
    }

    res.json(questions);
  } catch (err) {
    console.error('❌ Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
