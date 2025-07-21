// src/pages/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../features/context/authContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Bienvenue {user?.username}</h1>
      <p>Vous êtes connecté en tant que {user?.role}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

export default DashboardPage;
