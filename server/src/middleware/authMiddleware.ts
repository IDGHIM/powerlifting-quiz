import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Typage du payload JWT
interface JwtPayload {
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// 🔐 Interface pour compatibilité avec adminRoutes.ts
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Étendre Request pour incluer user (pour compatibilité globale)
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// 🔐 Middleware d'authentification de base - Compatible avec Authorization header ET cookies
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Chercher le token dans Authorization header (priorité)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Si pas trouvé, chercher dans les cookies (compatibilité)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('❌ Token manquant (header et cookies)');
    return res.status(401).json({ 
      message: 'No token provided',
      error: 'Token d\'authentification manquant' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    console.log(`✅ Utilisateur authentifié: ${decoded.username} (${decoded.role})`);
    next();
  } catch (err) {
    console.error('❌ JWT error:', err);
    return res.status(401).json({ 
      message: 'Invalid token',
      error: 'Token invalide ou expiré' 
    });
  }
};

// 🛡️ Middleware admin - Vérifie les droits administrateur
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Vérifier que l'utilisateur est authentifié
  if (!req.user) {
    console.log('❌ User non défini dans requireAdmin');
    return res.status(401).json({ 
      message: 'Not authenticated',
      error: 'Authentification requise pour accéder à cette ressource' 
    });
  }
  
  // Vérifier le rôle admin
  if (req.user.role !== 'admin') {
    console.log(`🚫 Accès refusé pour ${req.user.username} (role: ${req.user.role})`);
    return res.status(403).json({ 
      message: 'Access denied',
      error: 'Droits administrateur requis pour effectuer cette action' 
    });
  }
  
  console.log(`🛡️ Admin autorisé: ${req.user.username}`);
  next();
};

// 🔒 Middleware optionnel - Permet admin OU propriétaire de la ressource
export const requireAdminOrOwner = (resourceField: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log('❌ User non défini dans requireAdminOrOwner');
      return res.status(401).json({ 
        message: 'Not authenticated',
        error: 'Authentification requise' 
      });
    }
    
    // Admin a tous les droits
    if (req.user.role === 'admin') {
      console.log(`🛡️ Admin autorisé: ${req.user.username}`);
      return next();
    }
    
    // Vérifier si c'est le propriétaire de la ressource
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (req.user.email === resourceUserId || req.user.username === resourceUserId) {
      console.log(`✅ Propriétaire autorisé: ${req.user.username}`);
      return next();
    }
    
    console.log(`🚫 Accès refusé pour ${req.user.username} sur ressource ${resourceUserId}`);
    return res.status(403).json({ 
      message: 'Access denied',
      error: 'Vous pouvez seulement modifier vos propres données' 
    });
  };
};

// 🎯 Middleware pour vérifier un rôle spécifique
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Not authenticated',
        error: 'Authentification requise' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`🚫 Rôle insuffisant pour ${req.user.username} (role: ${req.user.role}, requis: ${roles.join(', ')})`);
      return res.status(403).json({ 
        message: 'Insufficient role',
        error: `Rôle requis: ${roles.join(' ou ')}` 
      });
    }
    
    console.log(`✅ Rôle autorisé: ${req.user.username} (${req.user.role})`);
    next();
  };
};

// 📊 Middleware de logging pour les actions sensibles
export const logAdminAction = (action: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalUrl = req.originalUrl;
    const method = req.method;
    const timestamp = new Date().toISOString();
    const adminUser = req.user?.username || 'Unknown';

    // Log l'action au début
    console.log(`📝 [${timestamp}] ACTION ADMIN: ${action} par ${adminUser}`);
    console.log(`📝 Détails: ${method} ${originalUrl}`);
    
    // Log les paramètres (sans données sensibles)
    if (Object.keys(req.params).length > 0) {
      console.log(`📝 Params:`, req.params);
    }
    
    // Log le body (sans mots de passe)
    if (req.body && Object.keys(req.body).length > 0) {
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
      if (sanitizedBody.newPassword) sanitizedBody.newPassword = '[HIDDEN]';
      console.log(`📝 Body:`, sanitizedBody);
    }

    next();
  };
};

// 🕒 Middleware de rate limiting pour les actions admin
export const rateLimitAdmin = (maxRequests: number = 10, windowMs: number = 60000) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const key = req.user.email || req.user.username;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyer les anciennes entrées
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < windowStart) {
        requests.delete(k);
      }
    }

    const userRequests = requests.get(key);
    
    if (!userRequests) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userRequests.resetTime < now) {
      // Reset le compteur
      requests.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userRequests.count >= maxRequests) {
      console.log(`🚫 Rate limit dépassé pour ${req.user.username}`);
      return res.status(429).json({
        message: 'Too many requests',
        error: `Maximum ${maxRequests} requêtes par minute autorisées`,
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
      });
    }

    userRequests.count++;
    next();
  };
};

// 🔍 Middleware de validation des paramètres admin
export const validateAdminParams = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Vérifier les IDs MongoDB dans les paramètres
  if (req.params.id) {
    const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!mongoIdPattern.test(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
        error: 'L\'ID fourni n\'est pas un ObjectId MongoDB valide'
      });
    }
  }

  // Validation spécifique selon la route
  const path = req.route?.path;
  
  // Validation pour reset password
  if (path?.includes('reset-password') && req.method === 'POST') {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        message: 'Invalid password',
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }
  }

  // Validation pour la recherche
  if (path?.includes('search')) {
    const { q } = req.query;
    if (q && typeof q === 'string' && q.length < 2) {
      return res.status(400).json({
        message: 'Search term too short',
        error: 'Minimum 2 caractères requis pour la recherche'
      });
    }
  }

  next();
};

// 🛡️ Guards préconçus pour différents niveaux de sécurité

// Guard standard pour routes admin
export const adminGuard = [
  authMiddleware,
  requireAdmin,
  validateAdminParams,
  rateLimitAdmin(20, 60000), // 20 requêtes par minute
  logAdminAction('ADMIN_ACTION')
];

// Guard pour les statistiques (moins restrictif)
export const adminStatsGuard = [
  authMiddleware,
  requireAdmin,
  rateLimitAdmin(50, 60000) // Plus de requêtes autorisées pour les stats
];

// Guard pour les actions destructives (très restrictif)
export const adminDestructiveGuard = [
  authMiddleware,
  requireAdmin,
  validateAdminParams,
  rateLimitAdmin(5, 60000), // Seulement 5 actions destructives par minute
  logAdminAction('DESTRUCTIVE_ACTION')
];

// Alias pour l'authentification de base (compatibilité)
export const authenticate = authMiddleware;

// Export par défaut pour compatibilité
export default authMiddleware;