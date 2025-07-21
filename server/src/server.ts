import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from 'routes/authRoutes';
import quizRoutes from 'routes/quizRoutes';
const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

dotenv.config();
// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(port, () => console.log(`🚀 Serveur sur http://localhost:${port}`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));

app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: ['http://localhost:3000','http://192.168.10.5:3000'],
  methods : ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Routes
app.use('/api', authRoutes);
app.use('/api', quizRoutes);



