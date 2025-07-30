import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // ✅ AJOUTÉ pour generateer les tokens
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import scoreRoutes from './routes/scoreRoutes';
import profileRoutes from './routes/profileRoutes';
import User from './models/userModel';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Middleware globaux
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.10.5:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH', 'PUT'],
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

// ✅ FORGOT PASSWORD - Génère le token de réinitialisation
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // ⚠️ Ne pas révéler si l'email existe ou non (sécurité)
      return res.json({ success: true, message: 'Email envoyé si le compte existe' });
    }

    // Génère un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarde en BDD
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiration
    });

    console.log('🔑 Token généré:', resetToken);
    console.log('🔑 Token sauvegardé pour:', user.email);

    // 🔗 URL de réinitialisation (à envoyer par email)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    console.log('🔗 Lien de reset:', resetUrl);

    // TODO: Intégrer l'envoi d'email (nodemailer, sendgrid, etc.)
    // Pour l'instant, le lien s'affiche dans la console
    
    res.json({ success: true, message: 'Email de réinitialisation envoyé' });
  } catch (err) {
    console.error('❌ Erreur forgot-password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ RESET PASSWORD - Vérifie le token et change le mot de passe
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  console.log('🔍 Token reçu côté serveur:', token);
  console.log('🔍 Longueur token:', token?.length);

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    // Cherche l'utilisateur avec le token valide et non expiré
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() }
    });

    console.log('🔍 Token trouvé en BDD:', !!user);

    if (!user) {
      // Debug : affiche tous les tokens actifs
      const allTokens = await User.find({ resetToken: { $ne: null } });
      console.log('🔍 Tous les tokens en BDD:', allTokens.map(u => ({
        email: u.email,
        token: u.resetToken,
        expiry: u.resetTokenExpiration
      })));
      
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Hash le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Met à jour le mot de passe et supprime le token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null
    });

    console.log('✅ Mot de passe mis à jour pour:', user.email);
    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });

  } catch (err) {
    console.error('❌ Erreur reset-password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
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
app.use('/api/profile', profileRoutes);

// Connexion MongoDB + lancement serveur
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`🔵 Démarrage du serveur sur le port ${port}...`);
    app.listen(5001, '0.0.0.0', () => console.log(`🚀 Serveur sur http://localhost:5001`));
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));