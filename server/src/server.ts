import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

// Middlewares globaux avant les routes
app.use(cors({
  origin: ['http://localhost:3000','http://192.168.10.5:3000'],
  methods : ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Logging simple
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// Route de test simple
app.get('/', (req, res) => {
  res.send('API est fonctionnelle !');
});

// Routes API
app.use('/api', authRoutes);
app.use('/api', quizRoutes);

// Connexion à MongoDB puis lancement serveur
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(port, () => console.log(`🚀 Serveur sur http://localhost:${port}`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));
