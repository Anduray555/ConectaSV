import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { IconExplorar, IconMensajes, IconDocumentos, IconPerfil } from '../assets/icons/dashboard/Iconos'
// TODO API: obtener la sesión, el perfil y el contador de mensajes sin leer.
import { perfilMock, sesionDashboardMock, conversacionesMock } from '../data/dashboard.mock'
import '../styles/dashboard.css'

const mensajesSinLeerMock = conversacionesMock.reduce((total, c) => total + c.sinLeer, 0)

// "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
const menu = [
  { to: '/dashboard/explorar', texto: 'Explorar', titulo: 'Explorar Oportunidades', icono: <IconExplorar /> },
  { to: '/dashboard/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes />, insignia: mensajesSinLeerMock },
  { to: '/dashboard/documentos', texto: 'Documentos SS', titulo: 'Servicio Social', icono: <IconDocumentos /> },
  { to: '/dashboard/perfil', texto: 'Mi Perfil', titulo: 'Mi Perfil', icono: <IconPerfil /> },
]

function DashboardLayout() {
  const { rol, ciclo } = sesionDashboardMock
  const { pathname } = useLocation()
  const actual = menu.find((item) => item.to === pathname)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <header className="marca">
          <b>C</b>
          <h2>ConectaSV</h2>
          <p>Plataforma estudiantil</p>
        </header>



        <nav>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'activo' : '')}
            >
              {item.icono}
              {item.texto}
              {item.insignia && <small>{item.insignia}</small>}
            </NavLink>
          ))}
          <Link to="/">Inicia sesión</Link>
        </nav>

        <footer className="usuario">
          <b>{perfilMock.siglas}</b>
          <strong>{perfilMock.nombre}</strong>
          <small>{rol} · {perfilMock.universidad}</small>
        </footer>
      </aside>

      <section className="area">
        <header className="barra">
          <h1>{actual?.titulo}</h1>
          <ul>
            <li>Ciclo {ciclo}</li>
            <li className="activo">{rol} activo</li>
          </ul>
        </header>

        <section className="contenido">
          {/* TODO API: retirar este aviso cuando los datos provengan del backend. */}
          <p className="aviso-datos-ejemplo">Datos de ejemplo · La conexión con el backend está pendiente. Los cambios son temporales.</p>
          <Outlet />
        </section>
      </section>
    </div>
  )
}

export default DashboardLayout
