import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { IconExplorar, IconProyecto, IconPerfil, IconDocumentos, IconMensajes } from '../assets/icons/dashboard/Iconos'
import { crearEstadoEmpresa } from '../data/estadoDashboard'
import '../styles/dashboard.css'
import '../styles/empresa.css'

const menu = [
  { ruta: 'dashboard', titulo: 'Dashboard', Icono: IconExplorar },
  { ruta: 'ofertas', titulo: 'Mis Ofertas', Icono: IconProyecto },
  { ruta: 'candidatos', titulo: 'Candidatos', Icono: IconPerfil },
  { ruta: 'documentos', titulo: 'Documentos SS', Icono: IconDocumentos },
  { ruta: 'mensajes', titulo: 'Mensajes', Icono: IconMensajes },
  { ruta: 'perfil', titulo: 'Perfil Empresa', Icono: IconPerfil },
]

export default function EmpresaLayout() {
  const { pathname } = useLocation()
  // TODO BACKEND: reemplazar estos estados iniciales por consultas de la sesión de empresa.
  // TODO BACKEND: obtener la identidad/rol de la sesión y comprobar acceso a /empresa también
  // en el servidor. El selector de dashboard no otorga autorización.
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
  const titulo = menu.find((m) => pathname === `/empresa/${m.ruta}`)?.titulo ?? 'Empresa'

  return (
    <div className="dashboard empresa-dashboard">
      <aside className="sidebar">
        <header className="marca"><Logo /></header>
        {/* TODO BACKEND: adaptar el cambio de dashboard al rol autorizado. */}
        <div className="empresa-roles" aria-label="Cambiar de dashboard"><Link to="/dashboard/explorar">Estudiante</Link><Link to="/empresa/dashboard" aria-current="page">Empresa</Link><Link to="/admin/dashboard">Admin</Link></div>
        <nav aria-label="Navegación de empresa">{menu.map(({ ruta, titulo, Icono }) => <NavLink key={ruta} to={`/empresa/${ruta}`} className={({ isActive }) => isActive ? 'activo' : ''}><Icono />{titulo}{ruta === 'mensajes' && sinLeer > 0 && <small>{sinLeer}</small>}</NavLink>)}</nav>
        {/* TODO BACKEND: mostrar nombre/logo y verificación reales; contemplar empresa no verificada. */}
        <footer className="usuario"><b>{empresa.siglas}</b><strong>{empresa.nombre || 'Perfil sin cargar'}</strong><small>{empresa.verificada === true ? 'Empresa verificada' : empresa.verificada === false ? 'Sin verificar' : '—'}</small></footer>
      </aside>
      <section className="area">
        {/* TODO BACKEND: sustituir el plan y la verificación fijos por los de la cuenta autenticada. */}
        <header className="barra"><h1>{titulo}</h1><ul>{empresa.plan && <li>{empresa.plan}</li>}{empresa.verificada != null && <li className={empresa.verificada ? 'activo' : undefined}>{empresa.verificada ? '✓ Verificado' : 'Sin verificar'}</li>}</ul></header>
        <section className="contenido">
          <Outlet context={{ setDatos, resumen, empresa, setEmpresa, ofertas, setOfertas, candidatos, expedientes, setExpedientes, conversaciones, setConversaciones }} />
        </section>
      </section>
    </div>
  )
}

