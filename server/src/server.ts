import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import scoreRoutes from './routes/scoreRoutes';
import profileRoutes from './routes/profileRoutes';
import AdminRoutes from './routes/adminRoutes';
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

// 📊 Middleware de logging détaillé
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🕐 [${timestamp}] ${req.method} ${req.url}`);
  
  // Log des paramètres pour debug
  if (Object.keys(req.params).length > 0) {
    console.log(`📋 Params:`, req.params);
  }
  if (Object.keys(req.query).length > 0) {
    console.log(`🔍 Query:`, req.query);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    // Masquer les mots de passe dans les logs
    const bodyLog = { ...req.body };
    if (bodyLog.password) bodyLog.password = '***HIDDEN***';
    if (bodyLog.newPassword) bodyLog.newPassword = '***HIDDEN***';
    console.log(`📦 Body:`, bodyLog);
  }
  
  // Intercepter la réponse pour logger le status
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`✅ Response Status: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  
  next();
});

// Route de base
app.get('/', (req, res) => {
  console.log('🏠 Route racine appelée');
  res.send('API est fonctionnelle !');
});

// 🔐 Middleware d'authentification
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('🔐 Middleware authenticate appelé');
  const token = req.cookies.token;
  
  if (!token) {
    console.log('❌ Aucun token trouvé');
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email: string; role: string };
    console.log(`✅ Token valide pour: ${decoded.username} (${decoded.role})`);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.log('❌ Token invalide:', err instanceof Error ? err.message : 'Erreur inconnue');
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// ✅ REGISTER
app.post('/api/register', async (req, res) => {
  console.log('📝 Route REGISTER appelée');
  const { username, email, password, role = 'user' } = req.body;

  if (!username || !email || !password) {
    console.log('❌ Champs manquants pour register');
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      console.log(`❌ Utilisateur déjà existant: ${existing.username || existing.email}`);
      return res.status(409).json({ error: 'Nom d\'utilisateur ou email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    
    console.log(`✅ Nouvel utilisateur créé: ${username} (${role})`);
    res.status(201).json({ success: true, message: 'Utilisateur enregistré.' });
  } catch (err) {
    console.error('❌ Erreur enregistrement :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ✅ LOGIN (par username ou email)
app.post('/api/login', async (req, res) => {
  console.log('🔑 Route LOGIN appelée');
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    console.log('❌ Champs manquants pour login');
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${identifier}`);
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`❌ Mot de passe incorrect pour: ${identifier}`);
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

    console.log(`✅ Login réussi pour: ${user.username} (${user.role})`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur login :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ✅ FORGOT PASSWORD - Génère le token de réinitialisation
app.post('/api/forgot-password', async (req, res) => {
  console.log('🔄 Route FORGOT-PASSWORD appelée');
  const { email } = req.body;

  if (!email) {
    console.log('❌ Email manquant pour forgot-password');
    return res.status(400).json({ error: 'Email requis' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Email non trouvé: ${email}`);
      // ⚠️ Ne pas révéler si l'email existe ou non (sécurité)
      return res.json({ success: true, message: 'Email envoyé si le compte existe' });
    }

    // Génère un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarde en BDD
    await User.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiration });

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
  console.log('🔄 Route RESET-PASSWORD appelée');
  const { token, newPassword } = req.body;
  
  console.log('🔍 Token reçu côté serveur:', token);
  console.log('🔍 Longueur token:', token?.length);

  if (!token || !newPassword) {
    console.log('❌ Token ou mot de passe manquant');
    return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
  }

  if (newPassword.length < 6) {
    console.log('❌ Mot de passe trop court');
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
  console.log('🚪 Route LOGOUT appelée');
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  console.log('✅ Cookie token supprimé');
  res.json({ success: true });
});

// ✅ ME
app.get('/api/me', authenticate, (req, res) => {
  console.log('👤 Route ME appelée');
  const { username, email, role } = (req as any).user;
  console.log(`✅ Informations utilisateur retournées: ${username} (${role})`);
  res.json({ username, email, role });
});

// 📊 Middleware pour logger les routes importées
const logRouteUsage = (routeName: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`🛣️  Route ${routeName} utilisée: ${req.method} ${req.originalUrl}`);
    next();
  };
};

// Autres routes avec logging
console.log('📁 Chargement des routes externes...');

app.use('/api', logRouteUsage('AUTH'), authRoutes);
console.log('✅ Routes AUTH chargées sur /api');

app.use('/api', logRouteUsage('QUIZ'), quizRoutes);
console.log('✅ Routes QUIZ chargées sur /api');

app.use('/api/ranking', logRouteUsage('SCORE'), scoreRoutes);
console.log('✅ Routes SCORE chargées sur /api/ranking');

app.use('/api/profile', logRouteUsage('PROFILE'), profileRoutes);
console.log('✅ Routes PROFILE chargées sur /api/profile');

app.use('/api/admin', logRouteUsage('ADMIN'), AdminRoutes);
console.log('✅ Routes ADMIN chargées sur /api/admin');

// 🚫 Middleware pour les routes non trouvées
app.use('*', (req: express.Request, res: express.Response) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 Erreur globale:', err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Connexion MongoDB + lancement serveur
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`🔵 Démarrage du serveur sur le port ${port}...`);
    
    app.listen(5001, '0.0.0.0', () => {
      console.log(`🚀 Serveur sur http://localhost:5001`);
      console.log('\n📋 ROUTES DISPONIBLES:');
      console.log('🏠 GET  / - Route racine');
      console.log('📝 POST /api/register - Inscription');
      console.log('🔑 POST /api/login - Connexion');
      console.log('🔄 POST /api/forgot-password - Mot de passe oublié');
      console.log('🔄 POST /api/reset-password - Réinitialiser mot de passe');
      console.log('🚪 POST /api/logout - Déconnexion');
      console.log('👤 GET  /api/me - Infos utilisateur');
      console.log('🛣️  /api/* - Routes auth supplémentaires');
      console.log('🧩 /api/* - Routes quiz');
      console.log('🏆 /api/ranking/* - Routes scores');
      console.log('👤 /api/profile/* - Routes profil');
      console.log('👑 /api/admin/* - Routes admin');
      console.log('\n🎯 Surveillez les logs ci-dessous pour voir l\'activité...\n');
    });
  })
  .catch(err => console.error('❌ Erreur connexion MongoDB', err));