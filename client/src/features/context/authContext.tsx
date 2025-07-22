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

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Fonction pour décoder un JWT
  const decodeToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.username,
        role: payload.role,
      };
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
      return null;
    }
  };

  // Effet : on recharge l'utilisateur depuis le token au chargement
  useEffect(() => {
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
        setRole(decodedUser.role);
      }
    } else {
      setUser(null);
      setRole(null);
    }
  }, [token]);

  // Fonction login
  const login = async (username: string, password: string) => {
    const response = await axios.post('http://localhost:5001/api/login', { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    setToken(token);

    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setUser(decodedUser);
      setRole(decodedUser.role);
    }
  };

  // Fonction register
  const register = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
    await axios.post('http://localhost:5001/api/register', { username, password, role });
    // Pas de connexion automatique après l'inscription
  };

  // Fonction logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};
