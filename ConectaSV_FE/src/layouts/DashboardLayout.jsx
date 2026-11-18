import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconExplorar, IconMensajes, IconDocumentos, IconPerfil } from '../assets/icons/dashboard/Iconos'
import { Logo } from '../components/Logo'
// TODO API: obtener el perfil y el contador de mensajes sin leer.
import { crearEstadoEstudiante } from '../data/estadoDashboard'
import CuentaSidebar from '../components/dashboard/CuentaSidebar'
import '../styles/dashboard.css'


// "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
const menu = [
  { to: '/dashboard/explorar', texto: 'Explorar', titulo: 'Explorar Oportunidades', icono: <IconExplorar /> },
  { to: '/dashboard/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes /> },
  { to: '/dashboard/documentos', texto: 'Documentos SS', titulo: 'Servicio Social', icono: <IconDocumentos /> },
  { to: '/dashboard/perfil', texto: 'Mi Perfil', titulo: 'Mi Perfil', icono: <IconPerfil /> },
]

function DashboardLayout() {
  // TODO BACKEND: cargar la sesión y los datos del estudiante; actualizar con setDatos.
  const [datos, setDatos] = useState(crearEstadoEstudiante)
  const { sesion: { rol, ciclo, activa }, conversaciones } = datos
  const sinLeer = conversaciones.reduce((total, c) => total + (c.sinLeer ?? 0), 0)
  const { pathname } = useLocation()
  const actual = menu.find((item) => item.to === pathname)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <header className="marca">
          <Logo></Logo>
          {/* <p>Plataforma estudiantil</p> */}
        </header>

        <nav aria-label="Navegación de estudiante">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'activo' : '')}
            >
              {item.icono}
              {item.texto}
              {item.to === '/dashboard/mensajes' && sinLeer > 0 && <small>{sinLeer}</small>}
            </NavLink>
          ))}
        </nav>

        <CuentaSidebar />
      </aside>

      <section className="area">
        <header className="barra">
          <h1>{actual?.titulo}</h1>
          <ul>
            {ciclo && <li>Ciclo {ciclo}</li>}
            {rol && <li className={activa ? 'activo' : undefined}>{rol}{activa === true ? ' activo' : ''}</li>}
          </ul> 
        </header>

        <section className="contenido">
          <Outlet context={{ ...datos, setDatos }} />
        </section>
      </section>
    </div>
  )
}

export default DashboardLayout


