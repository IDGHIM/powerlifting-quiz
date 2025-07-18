import express from 'express';
import cors from 'cors';
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_clé'; // Clé secrète pour JWT

// Middlewares globaux
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse le JSON dans le body des requêtes

// Middleware de logging simple : affiche méthode + URL pour chaque requête
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// --- Schéma Mongoose pour les questions de quiz ---
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

// --- Schéma Mongoose pour les utilisateurs ---
interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true }, // username unique
  passwordHash: { type: String, required: true }, // mot de passe haché
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // rôle utilisateur/admin
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// --- Middleware d'authentification JWT ---
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Extraire le token Bearer

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  // Vérifier la validité du token JWT
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user; // Ajouter l'utilisateur décodé à la requête
    next();
  });
}

// --- Routes d'authentification ---

// Enregistrement d'un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validation des champs obligatoires
    if (!username || !password) {
      return res.status(400).json({ message: 'Champs requis : username, password' });
    }

    // Hashage du mot de passe avec bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, passwordHash, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    console.error('Erreur /register:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte' });
  }
});

// Connexion utilisateur
app.post('/api/login', async (req, res) => {
  console.log('🔐 Tentative de connexion');
  try {
    const { username, password } = req.body;

    // Recherche utilisateur par username
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    // Comparaison du mot de passe avec le hash stocké
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Création du token JWT signé avec username et rôle, expirant dans 1h
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

// Route protégée accessible uniquement aux admins
app.get('/api/admin-data', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins' });
  }
  res.json({ secret: 'Voici des données secrètes pour admin' });
});

// Récupérer les questions selon la catégorie passée en query
app.get('/api/quiz', async (req, res) => {
  try {
    const rawCategory = req.query.category;

    // Validation du paramètre category
    if (!rawCategory || typeof rawCategory !== 'string') {
      return res.status(400).json({ error: 'Paramètre category requis' });
    }

    const category = rawCategory.trim().toLowerCase();

    // Affiche les catégories disponibles en base (debug)
    const allCategories = await QuestionModel.distinct('category');
    console.log('📚 Catégories disponibles en base :', allCategories);

    // Recherche des questions correspondant à la catégorie (insensible à la casse)
    const questions = await QuestionModel.find({
      category: { $regex: `^${category}$`, $options: 'i' },
    });

    // Si aucune question trouvée pour la catégorie
    if (!questions.length) {
      return res.status(404).json({ error: `Catégorie '${category}' non trouvée` });
    }

    res.json(questions);
  } catch (err) {
    console.error('❌ Erreur serveur /api/quiz :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Connexion à MongoDB + démarrage du serveur ---

dotenv.config();
const mongoUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

// Connexion à la base MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');

    // Affichage des routes enregistrées (utile pour debug)
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) { // routes enregistrées
        const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
        console.log(`Route active : ${methods} ${middleware.route.path}`);
      }
    });

    // Démarrage du serveur Express
    app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur connexion MongoDB', err);
  });
