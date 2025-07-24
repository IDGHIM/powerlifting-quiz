import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Interface représentant un utilisateur
interface User {
  username: string;
  email?: string;
  role: string;
}

// Interface du contexte d'authentification
interface AuthContextType {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    role?: 'user' | 'admin'
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration globale d'Axios
axios.defaults.withCredentials = true;

// Fournisseur du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Récupération de l'utilisateur actif au montage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/me');
        const { username, email, role } = response.data;
        setUser({ username, email, role });
        setRole(role);
      } catch (err) {
        setUser(null);
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  // Fonction de connexion avec identifiant (email ou username)
  const login = async (identifier: string, password: string) => {
    await axios.post('http://localhost:5001/api/login', { identifier, password });

    const response = await axios.get('http://localhost:5001/api/me');
    const { username, email, role } = response.data;
    setUser({ username, email, role });
    setRole(role);
  };

  // Fonction d'inscription
  const register = async (
    username: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user'
  ) => {
    await axios.post('http://localhost:5001/api/register', {
      username,
      email,
      password,
      role,
    });
  };

  // Fonction de déconnexion
  const logout = async () => {
    await axios.post('http://localhost:5001/api/logout');
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
