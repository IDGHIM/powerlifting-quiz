import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import scoreRoutes from './routes/scoreRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Middleware globaux
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.10.5:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // ✅ autorise les cookies cross-origin
}));
app.use(express.json());
app.use(cookieParser()); // ✅ permet de lire les cookies

// Logging simple
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.send('API est fonctionnelle !');
});

// Auth sécurisé via cookie JWT
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Auth routes sécurisées directement ici (ou à déplacer dans authRoutes)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // ❗ Exemple à remplacer par une vraie vérification avec MongoDB
  if (username && password) {
    const role = username === 'admin' ? 'admin' : 'user';
    const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // ✅ mettre à true en production (HTTPS)
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  res.json({ success: true });
});

app.get('/api/me', authenticate, (req, res) => {
  const { username, role } = (req as any).user;
  res.json({ username, role });
});

// Routes API métier
app.use('/api', authRoutes);
app.use('/api', quizRoutes);
app.use('/api/ranking', scoreRoutes);

// Connexion MongoDB + lancement serveur
console.log('Démarrage du script server.ts');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`🔵 Démarrage du serveur sur le port ${port}...`);
    app.listen(5001, '0.0.0.0', () => console.log(`🚀 Serveur sur http://localhost:5001`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));
