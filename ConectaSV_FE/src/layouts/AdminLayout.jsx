import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconExplorar, IconMensajes, IconPerfil } from '../assets/icons/dashboard/Iconos'
import { Logo } from '../components/Logo'
// TODO API: obtener el resumen y los tickets sin leer.
import { crearEstadoAdmin, ejecutarAccionAdmin } from '../data/estadoAdmin'
import CuentaSidebar from '../components/dashboard/CuentaSidebar'
import '../styles/dashboard.css'
import '../styles/admin.css'


// "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
const menu = [
  { to: '/admin/dashboard', texto: 'Dashboard', titulo: 'Panel Admin', icono: <IconExplorar /> },
  { to: '/admin/soporte', texto: 'Soporte', titulo: 'Mensajes de Soporte', icono: <IconMensajes /> },
  { to: '/admin/usuarios', texto: 'Usuarios', titulo: 'Gestión de Usuarios', icono: <IconPerfil /> },
]

function AdminLayout() {
  // TODO BACKEND: cargar sesión, resumen, pendientes y listados con cancelación de
  // peticiones al desmontar. Incorporar carga, error/reintento y paginación reales.
  const [datos, setDatos] = useState(crearEstadoAdmin)
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const sinLeer = datos.resumen?.ticketsSinLeer ?? 0
  const { pathname } = useLocation()
  const actual = menu.find((item) => item.to === pathname)

  async function accion(operacion, id, payload) {
    setOcupado(true)
    setError('')
    try {
      const actualizacion = await ejecutarAccionAdmin(operacion, id, payload)
      // TODO BACKEND: adaptar la respuesta y refrescar también resumen, pendientes
      // y listados afectados; no sustituir una lista completa por una sola página.
      setDatos((anterior) => ({ ...anterior, ...actualizacion }))
      return true
    } catch (err) {
      setError(err.message || 'No se pudo completar la operación.')
      return false
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="dashboard admin-dashboard">
      <aside className="sidebar">
        <header className="marca">
          <Logo></Logo>
        </header>

        <nav aria-label="Administración">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'activo' : '')}
            >
              {item.icono}
              {item.texto}
              {item.to === '/admin/soporte' && sinLeer > 0 && <small>{sinLeer}</small>}
            </NavLink>
          ))}
        </nav>

        <CuentaSidebar />
      </aside>

      <section className="area">
        <header className="barra">
          <h1>{actual?.titulo ?? 'Administración'}</h1>
          <ul>
            <li>Administración</li>
            {datos.sistema && <li className={datos.sistema.activo ? 'activo' : undefined}>{datos.sistema.activo ? 'Sistema activo' : 'Sistema inactivo'}</li>}
          </ul>
        </header>

        <section className="contenido">
          {error && <p className="admin-error" role="alert">{error}<button type="button" onClick={() => setError('')} aria-label="Cerrar error">×</button></p>}
          <Outlet context={{ datos, accion, ocupado }} />
        </section>
      </section>
    </div>
  )
}

export default AdminLayout
