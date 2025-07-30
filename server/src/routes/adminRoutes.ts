import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

// 🛡️ Toutes les routes admin utilisent ces middlewares
router.use(authenticate);
router.use(requireAdmin);

// 📊 Dashboard admin - Statistiques générales
router.get('/dashboard', async (req: AuthenticatedRequest, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    
    // Utilisateurs récents (7 derniers jours)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: lastWeek } 
    });

    // Derniers utilisateurs inscrits
    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    // Tokens de reset actifs
    const activeResetTokens = await User.countDocuments({ 
      resetToken: { $ne: null },
      resetTokenExpiration: { $gt: new Date() }
    });

    // Tokens expirés (à nettoyer)
    const expiredTokens = await User.countDocuments({ 
      resetToken: { $ne: null },
      resetTokenExpiration: { $lte: new Date() }
    });

    const stats = {
      users: {
        total: totalUsers,
        admins: totalAdmins,
        regular: totalRegularUsers,
        recentSignups: recentUsers
      },
      security: {
        activeResetTokens,
        expiredTokens
      },
      latestUsers
    };

    console.log(`📊 Dashboard consulté par ${req.user?.username}`);
    res.json({ success: true, stats });
  } catch (err) {
    console.error('❌ Erreur dashboard admin:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 👥 Lister tous les utilisateurs avec pagination et filtres
router.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100); // Max 100
    const skip = (page - 1) * limit;
    const role = req.query.role as string; // Filtre par rôle
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Construction du filtre
    const filter: any = {};
    if (role && ['user', 'admin'].includes(role)) {
      filter.role = role;
    }

    // Construction du tri
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    const users = await User.find(filter)
      .select('-password -resetToken') // Exclure les données sensibles
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Erreur liste users:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔍 Rechercher des utilisateurs
router.get('/users/search', async (req: AuthenticatedRequest, res) => {
  try {
    const { q: query, limit = '10' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Terme de recherche requis' });
    }

    if (query.length < 2) {
      return res.status(400).json({ error: 'Minimum 2 caractères pour la recherche' });
    }

    const searchLimit = Math.min(parseInt(limit as string), 50);

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password -resetToken')
    .limit(searchLimit)
    .sort({ username: 1 });

    console.log(`🔍 Recherche "${query}" par ${req.user?.username} - ${users.length} résultats`);
    res.json({ success: true, users, query });
  } catch (err) {
    console.error('❌ Erreur recherche user:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🎯 Obtenir un utilisateur spécifique
router.get('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetToken');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Informations supplémentaires pour l'admin
    const additionalInfo = {
      hasActiveResetToken: !!(user.resetToken && user.resetTokenExpiration && user.resetTokenExpiration > new Date()),
      accountAge: user.createdAt ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : null
    };

    res.json({ success: true, user, additionalInfo });
  } catch (err) {
    console.error('❌ Erreur récupération user:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ⬆️ Promouvoir un utilisateur admin
router.patch('/users/:id/promote', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Utilisateur déjà administrateur' });
    }

    user.role = 'admin';
    await user.save();

    console.log(`⬆️ ${user.username} promu admin par ${req.user?.username}`);
    res.json({ 
      success: true, 
      message: `${user.username} est maintenant administrateur`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Erreur promotion:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ⬇️ Rétrograder un admin en user
router.patch('/users/:id/demote', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.role === 'user') {
      return res.status(400).json({ error: 'Utilisateur déjà utilisateur standard' });
    }

    // Empêcher l'auto-rétrogradation
    if (user.email === req.user?.email) {
      return res.status(400).json({ 
        error: 'Auto-rétrogradation interdite',
        message: 'Vous ne pouvez pas vous rétrograder vous-même' 
      });
    }

    user.role = 'user';
    await user.save();

    console.log(`⬇️ ${user.username} rétrogradé en user par ${req.user?.username}`);
    res.json({ 
      success: true, 
      message: `${user.username} est maintenant utilisateur standard`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Erreur rétrogradation:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🗑️ Supprimer un utilisateur
router.delete('/users/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Empêcher l'auto-suppression
    if (user.email === req.user?.email) {
      return res.status(400).json({ 
        error: 'Auto-suppression interdite',
        message: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }

    // Sauvegarder les infos avant suppression pour les logs
    const deletedUserInfo = {
      username: user.username,
      email: user.email,
      role: user.role
    };

    await User.findByIdAndDelete(req.params.id);

    console.log(`🗑️ Utilisateur ${deletedUserInfo.username} (${deletedUserInfo.email}) supprimé par ${req.user?.username}`);
    res.json({ 
      success: true, 
      message: `Utilisateur ${deletedUserInfo.username} supprimé`,
      deletedUser: deletedUserInfo
    });
  } catch (err) {
    console.error('❌ Erreur suppression:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔄 Réinitialiser le mot de passe d'un utilisateur (par admin)
router.post('/users/:id/reset-password', async (req: AuthenticatedRequest, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'Nouveau mot de passe requis' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mot de passe requis (minimum 6 caractères)' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Nettoyer les tokens de reset existants
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    
    await user.save();

    console.log(`🔄 Mot de passe de ${user.username} réinitialisé par ${req.user?.username}`);
    res.json({ 
      success: true, 
      message: `Mot de passe de ${user.username} réinitialisé avec succès`
    });
  } catch (err) {
    console.error('❌ Erreur reset password admin:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🧹 Nettoyer les tokens expirés
router.post('/maintenance/clean-expired-tokens', async (req: AuthenticatedRequest, res) => {
  try {
    const result = await User.updateMany(
      { 
        resetToken: { $ne: null },
        resetTokenExpiration: { $lte: new Date() }
      },
      { 
        $unset: { 
          resetToken: "",
          resetTokenExpiration: "" 
        }
      }
    );

    console.log(`🧹 ${result.modifiedCount} tokens expirés nettoyés par ${req.user?.username}`);
    res.json({ 
      success: true, 
      message: `${result.modifiedCount} tokens expirés ont été nettoyés`,
      cleanedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('❌ Erreur nettoyage tokens:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📊 Statistiques détaillées
router.get('/stats/detailed', async (req: AuthenticatedRequest, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

    const stats = {
      users: {
        total: await User.countDocuments(),
        lastMonth: await User.countDocuments({ createdAt: { $gte: lastMonth } }),
        last3Months: await User.countDocuments({ createdAt: { $gte: last3Months } })
      },
      roles: {
        admins: await User.countDocuments({ role: 'admin' }),
        users: await User.countDocuments({ role: 'user' })
      },
      security: {
        activeTokens: await User.countDocuments({ 
          resetToken: { $ne: null },
          resetTokenExpiration: { $gt: now }
        }),
        expiredTokens: await User.countDocuments({ 
          resetToken: { $ne: null },
          resetTokenExpiration: { $lte: now }
        })
      }
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('❌ Erreur stats détaillées:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📋 Logs d'activité admin (bonus)
router.get('/activity-logs', async (req: AuthenticatedRequest, res) => {
  try {
    // Pour l'instant, retourne un placeholder
    // Tu pourrais créer un modèle AdminLog pour traquer les actions
    const logs = [
      {
        id: 1,
        admin: req.user?.username,
        action: 'VIEW_DASHBOARD',
        timestamp: new Date(),
        details: 'Consultation du dashboard admin'
      }
    ];

    res.json({ success: true, logs });
  } catch (err) {
    console.error('❌ Erreur logs activité:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;