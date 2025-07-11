import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/context/AuthContext.tsx';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default AdminRoute;