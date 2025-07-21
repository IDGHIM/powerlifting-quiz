import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Interface représentant un utilisateur
interface User {
  username: string;
  role: string;
}

// Interface du contexte d'authentification avec les méthodes exposées
interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

// Création du contexte AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État du token, initialisé depuis localStorage pour maintenir la connexion après un rafraîchissement
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  // État des informations utilisateur
  const [user, setUser] = useState<User | null>(null);
  // État du rôle utilisateur (facultatif mais pratique pour des vérifications rapides)
  const [role, setRole] = useState<string | null>(null);

  // Fonction qui décode un token JWT pour extraire les informations de l'utilisateur
  const decodeToken = (token: string): User | null => {
    try {
      // Décodage de la partie payload du JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.username,
        role: payload.role,
      };
    } catch (err) {
      console.error("Erreur de décodage du token", err);
      return null;
    }
  };

  // Effet qui s'exécute lorsqu'on reçoit un nouveau token : on décode et initialise l'utilisateur
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        setRole(decoded.role);
      }
    } else {
      // Si pas de token, on réinitialise tout
      setUser(null);
      setRole(null);
    }
  }, [token]);

  // Fonction de connexion : envoie les identifiants à l'API et récupère le token
  const login = async (username: string, password: string) => {
    const response = await axios.post('http://localhost:5000/api/login', { username, password });
    const token = response.data.token;
    // Stockage du token dans le localStorage
    localStorage.setItem('token', token);
    // Mise à jour du state React
    setToken(token);

    // Décodage immédiat du token pour récupérer l'utilisateur et son rôle
    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
      setRole(decoded.role);
    }
  };

  // Fonction d'inscription : enregistre un utilisateur via l'API
  const register = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
    await axios.post('http://localhost:5000/api/register', { username, password, role });
    // Pas de connexion automatique après inscription
  };

  // Fonction de déconnexion : supprime les informations d'authentification
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  // Fournisseur qui met à disposition l'état et les méthodes d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ user, token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte d'authentification
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
