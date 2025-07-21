import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from 'routes/authRoutes';
import quizRoutes from 'routes/quizRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_clé';

app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// JWT Middleware
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

// Routes
app.use('/api', authRoutes);
app.use('/api', quizRoutes);

// Exemple de route protégée admin
app.get('/api/admin-data', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  res.json({ secret: 'Voici des données secrètes pour admin' });
});

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(port, () => console.log(`🚀 Serveur sur http://localhost:${port}`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));
