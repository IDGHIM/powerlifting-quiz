import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Décoder le token pour en extraire le user + rôle
  const decodeToken = (token: string): User | null => {
    try {
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

  // Initialiser à partir du token s'il existe
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        setRole(decoded.role);
      }
    } else {
      setUser(null);
      setRole(null);
    }
  }, [token]);

  // Login
  const login = async (username: string, password: string) => {
    const response = await axios.post('http://localhost:5000/login', { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    setToken(token);

    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
      setRole(decoded.role);
    }
  };

  // Register (accept role with default 'user')
  const register = async (username: string, password: string, role: 'user' | 'admin' = 'user') => {
    await axios.post('http://localhost:5000/register', { username, password, role });
  };

  // Logout
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
