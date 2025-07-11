// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/context/AuthContext.tsx';

interface Props {
  children: JSX.Element;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
