import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
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
console.log('Démarrage du script server.ts');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`🔵 Démarrage du serveur sur le port ${port}...`);
    app.listen(5001, '0.0.0.0', () => console.log(`🚀 Serveur sur http://localhost:5001`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));


