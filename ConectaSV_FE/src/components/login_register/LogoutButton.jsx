import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// `redirigirA`: a dónde ir después de cerrar sesión. Por defecto, al login; la página de
// invitación lo cambia para quedarse en la misma invitación.
export default function LogoutButton({ className = '', children = 'Cerrar sesión', redirigirA = '/login' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await logout();
    navigate(redirigirA, { replace: true });
  };

  return (
    <button type="button" className={className} onClick={handleClick} disabled={loading}>
      {loading ? 'Cerrando sesión...' : children}
    </button>
  );
}
