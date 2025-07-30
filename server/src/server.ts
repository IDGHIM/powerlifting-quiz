import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import scoreRoutes from './routes/scoreRoutes';
import profileRoutes from './routes/profileRoutes'; // 🆕 AJOUTÉ
import User from './models/userModel';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Middleware globaux
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.10.5:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH', 'PUT'], // 🆕 AJOUTÉ PUT pour les updates
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API est fonctionnelle !');
});

// 🔐 Middleware d'authentification
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// ✅ REGISTER
app.post('/api/register', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ error: 'Nom dutilisateur ou email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Utilisateur enregistré.' });
  } catch (err) {
    console.error('Erreur enregistrement :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ✅ LOGIN (par username ou email)
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ✅ true en production avec HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ✅ LOGOUT
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  res.json({ success: true });
});

// ✅ ME
app.get('/api/me', authenticate, (req, res) => {
  const { username, email, role } = (req as any).user;
  res.json({ username, email, role });
});

// Autres routes
app.use('/api', authRoutes);
app.use('/api', quizRoutes);
app.use('/api/ranking', scoreRoutes);
app.use('/api/profile', profileRoutes); // 🆕 AJOUTÉ

// Connexion MongoDB + lancement serveur
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`🔵 Démarrage du serveur sur le port ${port}...`);
    app.listen(5001, '0.0.0.0', () => console.log(`🚀 Serveur sur http://localhost:5001`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));