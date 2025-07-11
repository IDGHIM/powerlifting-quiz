import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/context/AuthContext.tsx';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;