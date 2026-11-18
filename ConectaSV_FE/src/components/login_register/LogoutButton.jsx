import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LogoutButton({ className = '', children = 'Cerrar sesión' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <button type="button" className={className} onClick={handleClick} disabled={loading}>
      {loading ? 'Cerrando sesión...' : children}
    </button>
  );
}