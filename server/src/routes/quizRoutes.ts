import express from 'express';
import { Question } from '../models/questionModel';

const router = express.Router();

// 🧩 GET /api/quiz - Récupère les questions par catégorie
router.get('/quiz', async (req: express.Request, res: express.Response) => {
  console.log('🧩 Route GET /api/quiz appelée');
  
  try {
    const rawCategory = req.query.category;
    
    if (!rawCategory || typeof rawCategory !== 'string') {
      console.log('❌ Paramètre category manquant ou invalide');
      return res.status(400).json({ error: 'Paramètre category requis' });
    }
    
    const category = rawCategory.trim().toLowerCase();
    console.log(`🔍 Recherche questions pour la catégorie: "${category}"`);
    
    const questions = await Question.find({ 
      category: { $regex: `^${category}$`, $options: 'i' } 
    });
    
    if (!questions.length) {
      console.log(`❌ Aucune question trouvée pour la catégorie: "${category}"`);
      return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });
    }
    
    console.log(`✅ ${questions.length} questions trouvées pour "${category}"`);
    res.json(questions);
    
  } catch (err) {
    console.error('❌ Erreur /quiz :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🎲 GET /api/quiz/random - Questions aléatoires (optionnel)
router.get('/quiz/random', async (req: express.Request, res: express.Response) => {
  console.log('🎲 Route GET /api/quiz/random appelée');
  
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    
    console.log(`🔍 Recherche ${limit} questions aléatoires${category ? ` pour "${category}"` : ''}`);
    
    let query = {};
    if (category) {
      query = { category: { $regex: `^${category}$`, $options: 'i' } };
    }
    
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: limit } }
    ]);
    
    console.log(`✅ ${questions.length} questions aléatoires retournées`);
    res.json(questions);
    
  } catch (err) {
    console.error('❌ Erreur /quiz/random :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📊 GET /api/quiz/categories - Liste toutes les catégories disponibles
router.get('/quiz/categories', async (req: express.Request, res: express.Response) => {
  console.log('📊 Route GET /api/quiz/categories appelée');
  
  try {
    const categories = await Question.distinct('category');
    console.log(`✅ ${categories.length} catégories trouvées:`, categories);
    res.json(categories);
    
  } catch (err) {
    console.error('❌ Erreur /quiz/categories :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔢 GET /api/quiz/count - Compte les questions par catégorie
router.get('/quiz/count', async (req: express.Request, res: express.Response) => {
  console.log('🔢 Route GET /api/quiz/count appelée');
  
  try {
    const counts = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    console.log('✅ Comptage des questions par catégorie:', counts);
    res.json(counts);
    
  } catch (err) {
    console.error('❌ Erreur /quiz/count :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🆔 GET /api/quiz/:id - Récupère une question spécifique
router.get('/quiz/:id', async (req: express.Request, res: express.Response) => {
  console.log(`🆔 Route GET /api/quiz/${req.params.id} appelée`);
  
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      console.log(`❌ Question non trouvée: ${req.params.id}`);
      return res.status(404).json({ error: 'Question non trouvée' });
    }
    
    console.log(`✅ Question trouvée: ${question.question}`);
    res.json(question);
    
  } catch (err) {
    console.error('❌ Erreur /quiz/:id :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📋 Fonction pour lister les routes disponibles
function listQuizRoutes() {
  console.log('\n📍 ROUTES QUIZ DISPONIBLES:');
  console.log('   GET /api/quiz?category=CATEGORY - Questions par catégorie');
  console.log('   GET /api/quiz/random?limit=N&category=CATEGORY - Questions aléatoires');
  console.log('   GET /api/quiz/categories - Liste des catégories');
  console.log('   GET /api/quiz/count - Comptage par catégorie');
  console.log('   GET /api/quiz/:id - Question spécifique');
}

// Appeler au chargement du module
listQuizRoutes();

export default router;