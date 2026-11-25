import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconExplorar, IconMensajes, IconDocumentos, IconPerfil, IconProyecto, IconEmpresa, IconEquipo } from '../assets/icons/dashboard/Iconos'
import { Logo } from '../components/Logo'
import MenuUsuario from '../components/dashboard/MenuUsuario'
// TODO API: hidratar estos estados iniciales desde el backend.
import {
  crearEstadoEstudiante, crearEstadoEmpresa, crearEstadoAdmin, ejecutarAccionAdmin,
  perfilEstudianteDesdeUsuario, empresaDesdeUsuario, resumenDesdeApi, usuarioDesdeApi,
} from '../data/dashboard'
import { adminApi } from '../api/admin'
import { parseApiError } from '../api/errors'
import useAuth from '../hooks/useAuth'
import '../styles/dashboard.css'

// Layout único para los tres roles. La estructura (sidebar, barra y contenido) es la misma;
// lo que cambia por rol se define en DASHBOARDS: menú, ruta del perfil y datos del <Outlet>.
// Para un cambio estético global basta con editar este archivo y styles/dashboard.css.

const sumarSinLeer = (conversaciones) => conversaciones.reduce((total, c) => total + (c.sinLeer ?? 0), 0)

// Cada rol define un hook useDatos() que devuelve:
//   contexto  -> lo que reciben las páginas con useOutletContext()
//   sinLeer   -> número que se muestra junto al enlace marcado con `insignia`
//   error     -> (opcional) mensaje de error y limpiarError() para cerrarlo
const DASHBOARDS = {
  student: {
    clase: 'dashboard',
    navLabel: 'Navegación de estudiante',
    // "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
    menu: [
      { to: '/dashboard/explorar', texto: 'Explorar', titulo: 'Explorar Oportunidades', icono: <IconExplorar /> },
      { to: '/dashboard/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes />, insignia: true },
      { to: '/dashboard/documentos', texto: 'Documentos SS', titulo: 'Servicio Social', icono: <IconDocumentos /> },
    ],
    perfilRuta: '/dashboard/perfil',
    // Títulos de páginas que no están en la sidebar (se abren desde el menú de usuario).
    otrosTitulos: { '/dashboard/perfil': 'Mi Perfil' },
    useDatos() {
      // El perfil se llena con la sesión (GET /api/auth/me).
      // TODO BACKEND: cargar ofertas, conversaciones y expediente; actualizar con setDatos.
      const { user } = useAuth()
      const [datos, setDatos] = useState(crearEstadoEstudiante)
      // El perfil se calcula en cada render a partir de `user` (no se copia al estado):
      // así, cuando refreshUser() trae tags nuevos, Mi Perfil los muestra sin recargar la página.
      const perfil = { ...datos.perfil, ...perfilEstudianteDesdeUsuario(user) }
      return { contexto: { ...datos, perfil, setDatos }, sinLeer: sumarSinLeer(datos.conversaciones) }
    },
  },

  company: {
    clase: 'dashboard empresa-dashboard',
    navLabel: 'Navegación de empresa',
    tituloPorDefecto: 'Empresa',
    menu: [
      { to: '/empresa/dashboard', texto: 'Dashboard', titulo: 'Dashboard', icono: <IconExplorar /> },
      { to: '/empresa/ofertas', texto: 'Mis Ofertas', titulo: 'Mis Ofertas', icono: <IconProyecto /> },
      { to: '/empresa/candidatos', texto: 'Candidatos', titulo: 'Candidatos', icono: <IconPerfil /> },
      { to: '/empresa/documentos', texto: 'Documentos SS', titulo: 'Documentos SS', icono: <IconDocumentos /> },
      { to: '/empresa/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes />, insignia: true },
      // El perfil de la EMPRESA va en la barra lateral (es de todos los miembros)...
      { to: '/empresa/perfil', texto: 'Perfil Empresa', titulo: 'Perfil Empresa', icono: <IconEmpresa /> },
      // `mostrar` filtra el enlace según el usuario: los reclutadores no lo ven.
      // (Ocultarlo es solo comodidad: la protección real es company.owner en el backend.)
      { to: '/empresa/reclutadores', texto: 'Reclutadores', titulo: 'Reclutadores', icono: <IconEquipo />, mostrar: (user) => user?.company_member?.is_owner },
    ],
    // ...y el perfil de la PERSONA se abre desde el menú de usuario, como en los otros roles.
    perfilRuta: '/empresa/mi-perfil',
    otrosTitulos: { '/empresa/mi-perfil': 'Mi Perfil' },
    useDatos() {
      // TODO BACKEND: reemplazar el estado inicial por consultas de la sesión de empresa, con
      // carga, error, reintento y sesión expirada. Mantener aquí los datos compartidos para
      // reflejar los cambios entre las seis vistas.
      // Los datos de la empresa se llenan con la sesión (GET /api/auth/me).
      const { user } = useAuth()
      const [datos, setDatos] = useState(() => {
        const inicial = crearEstadoEmpresa()
        return { ...inicial, empresa: { ...inicial.empresa, ...empresaDesdeUsuario(user) } }
      })
      const actualizar = (campo) => (valor) =>
        setDatos((actual) => ({ ...actual, [campo]: typeof valor === 'function' ? valor(actual[campo]) : valor }))
      const { empresa, ofertas, candidatos, expedientes, conversaciones, resumen } = datos
      return {
        contexto: {
          setDatos, resumen, empresa, ofertas, candidatos, expedientes, conversaciones,
          setEmpresa: actualizar('empresa'),
          setOfertas: actualizar('ofertas'),
          setExpedientes: actualizar('expedientes'),
          setConversaciones: actualizar('conversaciones'),
        },
        // TODO BACKEND: usar el total real de mensajes sin leer, incluso con conversaciones paginadas.
        sinLeer: sumarSinLeer(conversaciones),
      }
    },
  },

  admin: {
    clase: 'dashboard admin-dashboard',
    navLabel: 'Administración',
    tituloPorDefecto: 'Administración',
    menu: [
      { to: '/admin/dashboard', texto: 'Dashboard', titulo: 'Panel Admin', icono: <IconExplorar /> },
      { to: '/admin/soporte', texto: 'Soporte', titulo: 'Mensajes de Soporte', icono: <IconMensajes />, insignia: true },
      { to: '/admin/usuarios', texto: 'Usuarios', titulo: 'Gestión de Usuarios', icono: <IconPerfil /> },
    ],
    perfilRuta: '/admin/perfil',
    otrosTitulos: { '/admin/perfil': 'Mi Perfil' },
    useDatos() {
      // El resumen (tarjetas del panel, perfil y registros recientes) se carga una vez aquí y
      // se comparte con todas las pantallas admin. La lista de usuarios la pide UsuariosAdmin.
      const [datos, setDatos] = useState(crearEstadoAdmin)
      const [error, setError] = useState('')
      const [ocupado, setOcupado] = useState(false)

      // GET /api/admin/summary. Se vuelve a llamar después de activar o suspender a alguien.
      const recargarResumen = useCallback(async (signal) => {
        try {
          const data = await adminApi.summary({ signal })
          setDatos((anterior) => ({
            ...anterior,
            resumen: resumenDesdeApi(data),
            recientes: data.recent.map(usuarioDesdeApi),
            cargado: true,
          }))
        } catch (err) {
          if (signal?.aborted) return
          setError(parseApiError(err).message)
        }
      }, [])

      useEffect(() => {
        const control = new AbortController()
        recargarResumen(control.signal)
        return () => control.abort()
      }, [recargarResumen])

      // Acciones de soporte (tickets). Aún no hay backend: ejecutarAccionAdmin avisa con un error.
      async function accion(operacion, id, payload) {
        setOcupado(true)
        setError('')
        try {
          const actualizacion = await ejecutarAccionAdmin(operacion, id, payload)
          setDatos((anterior) => ({ ...anterior, ...actualizacion }))
          return true
        } catch (err) {
          setError(err.message || 'No se pudo completar la operación.')
          return false
        } finally {
          setOcupado(false)
        }
      }

      return {
        contexto: { datos, accion, ocupado, recargarResumen },
        sinLeer: datos.resumen?.ticketsSinLeer ?? 0,
        error,
        limpiarError: () => setError(''),
      }
    },
  },
}

// `rol` es fijo para cada ruta (student | company | admin), por eso es seguro
// llamar al hook useDatos() del rol en cada render.
function DashboardLayout({ rol }) {
  const config = DASHBOARDS[rol]
  const { contexto, sinLeer, error, limpiarError } = config.useDatos()
  const { user } = useAuth()
  const { pathname } = useLocation()
  // Enlaces visibles para este usuario (sin `mostrar` = visible para todos).
  const menu = config.menu.filter((item) => !item.mostrar || item.mostrar(user))
  const actual = menu.find((item) => item.to === pathname)

  return (
    <div className={config.clase}>
      <aside className="sidebar">
        <header className="marca">
          <Logo />
        </header>

        <nav aria-label={config.navLabel}>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'activo' : '')}
            >
              {item.icono}
              {item.texto}
              {item.insignia && sinLeer > 0 && <small>{sinLeer}</small>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="area">
        <header className="barra">
          <h1>{actual?.titulo ?? config.otrosTitulos?.[pathname] ?? config.tituloPorDefecto}</h1>
          <MenuUsuario perfilRuta={config.perfilRuta} />
        </header>

        <section className="contenido">
          {error && (
            <p className="admin-error" role="alert">
              {error}
              <button type="button" onClick={limpiarError} aria-label="Cerrar error">×</button>
            </p>
          )}
          <Outlet context={contexto} />
        </section>
      </section>
    </div>
  )
}

export default DashboardLayout
