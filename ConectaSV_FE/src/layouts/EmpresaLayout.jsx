import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { IconExplorar, IconProyecto, IconPerfil, IconDocumentos, IconMensajes } from '../assets/icons/dashboard/Iconos'
import { Logo } from '../components/Logo'
// TODO API: obtener la empresa y el contador de mensajes sin leer.
import { crearEstadoEmpresa } from '../data/estadoDashboard'
import CuentaSidebar from '../components/dashboard/CuentaSidebar'
import '../styles/dashboard.css'
import '../styles/empresa.css'


// "texto" es lo que se ve en la sidebar; "titulo" lo que se ve en la barra superior
const menu = [
  { to: '/empresa/dashboard', texto: 'Dashboard', titulo: 'Dashboard', icono: <IconExplorar /> },
  { to: '/empresa/ofertas', texto: 'Mis Ofertas', titulo: 'Mis Ofertas', icono: <IconProyecto /> },
  { to: '/empresa/candidatos', texto: 'Candidatos', titulo: 'Candidatos', icono: <IconPerfil /> },
  { to: '/empresa/documentos', texto: 'Documentos SS', titulo: 'Documentos SS', icono: <IconDocumentos /> },
  { to: '/empresa/mensajes', texto: 'Mensajes', titulo: 'Mensajes', icono: <IconMensajes /> },
  { to: '/empresa/perfil', texto: 'Perfil Empresa', titulo: 'Perfil Empresa', icono: <IconPerfil /> },
]

function EmpresaLayout() {
  // TODO BACKEND: reemplazar estos estados iniciales por consultas de la sesión de empresa.
  // TODO BACKEND: añadir carga, error, reintento y sesión expirada a las consultas;
  // adaptar campos, ids y relaciones de las respuestas al modelo de las vistas.
  // Mantener aquí los datos compartidos para reflejar los cambios entre las seis vistas.
  const [datos, setDatos] = useState(crearEstadoEmpresa)
  const { empresa, ofertas, candidatos, expedientes, conversaciones, resumen } = datos
  const actualizar = (campo, valor) => setDatos((actual) => ({ ...actual, [campo]: typeof valor === 'function' ? valor(actual[campo]) : valor }))
  const setEmpresa = (valor) => actualizar('empresa', valor)
  const setOfertas = (valor) => actualizar('ofertas', valor)
  const setExpedientes = (valor) => actualizar('expedientes', valor)
  const setConversaciones = (valor) => actualizar('conversaciones', valor)
  // TODO BACKEND: usar el total real de mensajes sin leer, incluso con conversaciones paginadas.
  const sinLeer = conversaciones.reduce((total, c) => total + (c.sinLeer ?? 0), 0)
  const { pathname } = useLocation()
  const actual = menu.find((item) => item.to === pathname)

  return (
    <div className="dashboard empresa-dashboard">
      <aside className="sidebar">
        <header className="marca">
          <Logo></Logo>
        </header>

        <nav aria-label="Navegación de empresa">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'activo' : '')}
            >
              {item.icono}
              {item.texto}
              {item.to === '/empresa/mensajes' && sinLeer > 0 && <small>{sinLeer}</small>}
            </NavLink>
          ))}
        </nav>

        <CuentaSidebar />
      </aside>

      <section className="area">
        {/* TODO BACKEND: sustituir el plan y la verificación fijos por los de la cuenta autenticada. */}
        <header className="barra">
          <h1>{actual?.titulo ?? 'Empresa'}</h1>
          <ul>
            {empresa.plan && <li>{empresa.plan}</li>}
            {empresa.verificada != null && <li className={empresa.verificada ? 'activo' : undefined}>{empresa.verificada ? '✓ Verificado' : 'Sin verificar'}</li>}
          </ul>
        </header>

        <section className="contenido">
          <Outlet context={{ setDatos, resumen, empresa, setEmpresa, ofertas, setOfertas, candidatos, expedientes, setExpedientes, conversaciones, setConversaciones }} />
        </section>
      </section>
    </div>
  )
}

export default EmpresaLayout
