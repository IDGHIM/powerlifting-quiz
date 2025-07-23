import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Interface représentant un utilisateur
interface User {
  username: string;
  role: string;
}

// Interface du contexte d'authentification
interface AuthContextType {
  user: User | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration globale d'Axios
axios.defaults.withCredentials = true; // ✅ Active l'envoi automatique des cookies

// Fournisseur du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Charger l'utilisateur connecté au chargement de l'app
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/me');
        const { username, role } = response.data;
        setUser({ username, role });
        setRole(role);
      } catch (err) {
        setUser(null);
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  // Fonction login
  const login = async (username: string, password: string) => {
    await axios.post('http://localhost:5001/api/login', { username, password });

    const response = await axios.get('http://localhost:5001/api/me');
    const { username: name, role: userRole } = response.data;
    setUser({ username: name, role: userRole });
    setRole(userRole);
  };

  // Fonction register
  const register = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
    await axios.post('http://localhost:5001/api/register', { username, password, role });
    // L'utilisateur devra se connecter manuellement après
  };

  // Fonction logout
  const logout = async () => {
    await axios.post('http://localhost:5001/api/logout');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout }}>
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
