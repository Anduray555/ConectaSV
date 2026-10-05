import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconExplorar, IconMensajes, IconDocumentos, IconPerfil } from '../assets/icons/dashboard/Iconos'
import '../styles/dashboard.css'

const roles = ['Estudiante', 'Empresa', 'Admin']

// "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
const menu = [
  { to: '/dashboard/explorar', texto: 'Explorar', titulo: 'Explorar Oportunidades', icono: <IconExplorar /> },
  { to: '/dashboard/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes />, insignia: 2 },
  { to: '/dashboard/documentos', texto: 'Documentos SS', titulo: 'Servicio Social', icono: <IconDocumentos /> },
  { to: '/dashboard/perfil', texto: 'Mi Perfil', titulo: 'Mi Perfil', icono: <IconPerfil /> },
]

function DashboardLayout() {
  const [rol, setRol] = useState('Estudiante')
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

{/*         <menu className="roles">
          {roles.map((r) => (
            <li key={r}>
              <button
                type="button"
                className={rol === r ? 'activo' : ''}
                onClick={() => setRol(r)}
              >
                {r}
              </button>
            </li>
          ))}
        </menu> */}

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
        </nav>

        <footer className="usuario">
          <b>AM</b>
          <strong>Andrea Martínez</strong>
          <small>Estudiante · UES</small>
        </footer>
      </aside>

      <section className="area">
        <header className="barra">
          <h1>{actual?.titulo}</h1>
          <ul>
            <li>Ciclo 02-2024</li>
            <li className="activo">{rol} activo</li>
          </ul>
        </header>

        <section className="contenido">
          <Outlet />
        </section>
      </section>
    </div>
  )
}

export default DashboardLayout
