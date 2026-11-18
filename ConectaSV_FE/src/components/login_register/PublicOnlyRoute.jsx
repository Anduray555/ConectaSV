import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { homeFor } from '../../utils/roleRoutes';

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  return <Outlet />;
}