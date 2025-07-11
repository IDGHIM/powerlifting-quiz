import express from 'express';
import cors from 'cors';
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_clé';

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de log simple
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// --- Schéma Question ---
interface IQuestion extends Document {
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const questionSchema = new mongoose.Schema<IQuestion>({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
});

const QuestionModel: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

// --- Schéma User ---
interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// --- Middleware Auth JWT ---
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
}

// --- Routes Auth ---

// Enregistrement
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Champs requis : username, password' });
    }

    const existing = await UserModel.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, passwordHash, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    console.error('Erreur /register:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte' });
  }
});

// Connexion
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erreur /login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// Route protégée (admin)
app.get('/api/admin-data', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins' });
  }
  res.json({ secret: 'Voici des données secrètes pour admin' });
});

// Quiz : récupérer les questions
app.get('/api/quiz', async (req, res) => {
  try {
    const rawCategory = req.query.category;

    if (!rawCategory || typeof rawCategory !== 'string') {
      return res.status(400).json({ error: 'Paramètre category requis' });
    }

    const category = rawCategory.trim().toLowerCase();

    const allCategories = await QuestionModel.distinct('category');
    console.log('📚 Catégories disponibles en base :', allCategories);

    const questions = await QuestionModel.find({
      category: { $regex: `^${category}$`, $options: 'i' },
    });

    if (!questions.length) {
      return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });
    }

    res.json(questions);
  } catch (err) {
    console.error('❌ Erreur serveur /api/quiz :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Connexion à Mongo + lancement serveur ---
mongoose
  .connect('mongodb://localhost:27017/quizdb')
  .then(() => {
    console.log('✅ MongoDB connecté');

    // Affichage des routes définies
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) { // routes enregistrées
        const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
        console.log(`Route active : ${methods} ${middleware.route.path}`);
      }
    });

    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur connexion MongoDB', err);
  });
