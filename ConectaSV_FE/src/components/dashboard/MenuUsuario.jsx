import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { companyRoleLabel, roleLabel } from '../../utils/roleRoutes'
import { IconLogOut, IconPerfil } from '../../assets/icons/dashboard/Iconos'
import LogoutButton from '../login_register/LogoutButton'

// Cuenta del usuario en la esquina superior derecha de la barra (igual en los tres roles):
// foto (o iniciales), nombre y rol; al hacer clic abre un menú con "Ver perfil" y "Cerrar sesión".
// Los datos vienen de useAuth(), que los obtiene de GET /api/auth/me.
export default function MenuUsuario({ perfilRuta }) {
  const { user } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  // Cierra el menú al hacer clic fuera o al pulsar Escape.
  useEffect(() => {
    if (!abierto) return
    const alClicFuera = (e) => { if (!contenedor.current?.contains(e.target)) setAbierto(false) }
    const alPulsarTecla = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', alClicFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alClicFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [abierto])

  // ProtectedRoute ya garantiza que hay usuario, pero nos protegemos igual.
  if (!user) return null

  const nombre = [user.first_name, user.first_surname].filter(Boolean).join(' ')
  const siglas = `${user.first_name?.[0] ?? ''}${user.first_surname?.[0] ?? ''}`.toUpperCase()
  // TODO BACKEND: exponer la foto del usuario (p. ej. avatar_url) en UserResource.
  const foto = user.avatar_url

  return (
    <div className="menu-usuario" ref={contenedor}>
      <button
        type="button"
        className="menu-usuario-boton"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        {foto ? <img className="menu-usuario-foto" src={foto} alt="" /> : <b className="menu-usuario-foto">{siglas}</b>}
        <span className="menu-usuario-datos">
          <strong>{nombre}</strong>
          {/* En empresa se distingue Propietario / Reclutador; en los demás roles, el rol general. */}
          <small>{user.company_member ? companyRoleLabel(user.company_member.role) : roleLabel(user.role)}</small>
        </span>
        <svg className="menu-usuario-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {abierto && (
        <ul className="menu-usuario-lista" role="menu">
          {perfilRuta && (
            <li role="none">
              <Link role="menuitem" to={perfilRuta} onClick={() => setAbierto(false)}>
                <IconPerfil /> Ver perfil
              </Link>
            </li>
          )}
          <li role="none">
            <LogoutButton className="menu-usuario-salir">
              <IconLogOut /> Cerrar sesión
            </LogoutButton>
          </li>
        </ul>
      )}
    </div>
  )
}
