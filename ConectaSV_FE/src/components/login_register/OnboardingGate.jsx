import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { rutaOnboarding } from '../../utils/onboarding'

// Guardia de los dashboards (estudiante y empresa): si el usuario tiene una pantalla de
// bienvenida pendiente, lo manda allí. Va DENTRO de ProtectedRoute, así que hay usuario.
// Funciona igual tras registrarse, al iniciar sesión o al escribir la URL a mano.
export default function OnboardingGate() {
  const { user } = useAuth()
  const ruta = rutaOnboarding(user)

  if (ruta) return <Navigate to={ruta} replace />

  return <Outlet />
}
