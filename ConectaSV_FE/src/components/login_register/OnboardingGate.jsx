import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { necesitaOnboarding, RUTA_ONBOARDING } from '../../utils/onboarding'

// Guardia del dashboard de estudiante: si aún no pasó por "Completa tu perfil",
// lo manda allí. Va DENTRO de ProtectedRoute, así que aquí ya sabemos que hay usuario.
// Funciona igual tras registrarse, al iniciar sesión o al escribir /dashboard a mano.
export default function OnboardingGate() {
  const { user } = useAuth()

  if (necesitaOnboarding(user)) return <Navigate to={RUTA_ONBOARDING} replace />

  return <Outlet />
}
