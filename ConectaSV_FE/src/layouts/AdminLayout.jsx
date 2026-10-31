import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { IconExplorar, IconMensajes, IconPerfil } from '../assets/icons/dashboard/Iconos'
import { crearEstadoAdmin, ejecutarAccionAdmin } from '../data/estadoAdmin'
import '../styles/dashboard.css'
import '../styles/admin.css'

const menu = [
  { ruta: 'dashboard', texto: 'Dashboard', titulo: 'Panel Admin', Icono: IconExplorar },
  { ruta: 'soporte', texto: 'Soporte', titulo: 'Mensajes de Soporte', Icono: IconMensajes },
  { ruta: 'usuarios', texto: 'Usuarios', titulo: 'Gestión de Usuarios', Icono: IconPerfil },
]

export default function AdminLayout() {
  const [datos, setDatos] = useState(crearEstadoAdmin)
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const { pathname } = useLocation()
  const actual = menu.find((item) => pathname === `/admin/${item.ruta}`)
  // TODO BACKEND: cargar sesión, resumen, pendientes y listados con cancelación de
  // peticiones al desmontar. Incorporar carga, error/reintento y paginación reales.
  // Verificar rol admin antes de consultar; 401 => login, 403 => acceso denegado.
  // El selector de vistas sirve para navegación local y NO concede permisos.
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
        <header className="marca"><Logo /></header>
        <div className="admin-roles" aria-label="Cambiar de dashboard"><Link to="/dashboard/explorar">Estudiante</Link><Link to="/empresa/dashboard">Empresa</Link><Link to="/admin/dashboard" aria-current="page">Admin</Link></div>
        <nav aria-label="Administración">{menu.map(({ ruta, texto, Icono }) => <NavLink key={ruta} to={`/admin/${ruta}`} className={({ isActive }) => isActive ? 'activo' : ''}><Icono />{texto}{ruta === 'soporte' && datos.resumen?.ticketsSinLeer > 0 && <small>{datos.resumen.ticketsSinLeer}</small>}</NavLink>)}</nav>
        {/* TODO BACKEND: identidad del administrador autenticado, nunca una cuenta fija. */}
        <footer className="usuario"><b>{datos.sesion?.siglas || '—'}</b><strong>{datos.sesion?.nombre || 'Sesión sin cargar'}</strong><small>{datos.sesion?.correo || '—'}</small></footer>
      </aside>
      <section className="area">
        <header className="barra"><h1>{actual?.titulo || 'Administración'}</h1><ul><li>Administración</li>{datos.sistema && <li className={datos.sistema.activo ? 'activo' : undefined}>{datos.sistema.activo ? 'Sistema activo' : 'Sistema inactivo'}</li>}</ul></header>
        <section className="contenido">
          {error && <p className="admin-error" role="alert">{error}<button type="button" onClick={() => setError('')} aria-label="Cerrar error">×</button></p>}
          <Outlet context={{ datos, accion, ocupado }} />
        </section>
      </section>
    </div>
  )
}
