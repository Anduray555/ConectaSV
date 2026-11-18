import useAuth from '../../hooks/useAuth'
import { roleLabel } from '../../utils/roleRoutes'
import { IconLogOut } from '../../assets/icons/dashboard/Iconos'
import LogoutButton from '../login_register/LogoutButton'

// Parte inferior de la sidebar, igual en los tres dashboards:
// el botón "Cerrar sesión" y, debajo, la cuenta que inició sesión.
// Los datos vienen de useAuth(), que los obtiene de GET /api/auth/me.
export default function CuentaSidebar() {
  const { user } = useAuth()

  // ProtectedRoute ya garantiza que hay usuario, pero nos protegemos igual.
  if (!user) return null

  const nombre = [user.first_name, user.first_surname].filter(Boolean).join(' ')
  const siglas = `${user.first_name?.[0] ?? ''}${user.first_surname?.[0] ?? ''}`.toUpperCase()

  return (
    <section className="cuenta">
      <LogoutButton className="sidebar-link">
        <IconLogOut /> Cerrar sesión
      </LogoutButton>

      <footer className="usuario">
        <b>{siglas}</b>
        <strong>{nombre}</strong>
        <small>{roleLabel(user.role)}</small>
      </footer>
    </section>
  )
}
