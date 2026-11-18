import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { homeFor } from '../../utils/roleRoutes';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }

  return <Outlet />;
}