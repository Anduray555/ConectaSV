import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { TOKEN_KEY } from '../api/client';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === TOKEN_KEY && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const startSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await authApi.login(credentials)),
    [startSession],
  );

  // tipo: 'estudiante' | 'empresa'. Al registrarse, el backend ya devuelve la sesión.
  const register = useCallback(
    async (tipo, data) => {
      const request = tipo === 'empresa' ? authApi.registerCompany : authApi.registerStudent;
      return startSession(await request(data));
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // El token ya no era válido: igual cerramos la sesión local.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  // Vuelve a pedir el usuario al backend. Se usa después de cambiar datos que vienen en
  // /auth/me (tags, onboarded_at...), para que toda la app vea la versión actualizada.
  const refreshUser = useCallback(async () => {
    const data = await authApi.me();
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}