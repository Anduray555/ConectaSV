import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { IconExplorar, IconProyecto, IconPerfil, IconDocumentos, IconMensajes } from '../assets/icons/dashboard/Iconos'
import { empresaMock, ofertasEmpresaMock, candidatosEmpresaMock, expedientesEmpresaMock, conversacionesEmpresaMock } from '../data/empresa.mock'
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
  // en el servidor. No usar el selector de demostración como autorización.
  // TODO BACKEND: añadir carga, error, reintento y sesión expirada a las consultas;
  // adaptar campos, ids y relaciones de las respuestas al modelo de las vistas.
  // Mantener aquí los datos compartidos para reflejar los cambios entre las seis vistas.
  const [empresa, setEmpresa] = useState(() => structuredClone(empresaMock))
  const [ofertas, setOfertas] = useState(() => structuredClone(ofertasEmpresaMock))
  const [candidatos] = useState(() => structuredClone(candidatosEmpresaMock))
  const [expedientes, setExpedientes] = useState(() => structuredClone(expedientesEmpresaMock))
  const [conversaciones, setConversaciones] = useState(() => structuredClone(conversacionesEmpresaMock))
  // TODO BACKEND: estas URLs blob solo permiten previsualizar archivos locales.
  // Usar archivos persistidos/URLs autorizadas del servidor para documentos guardados.
  const archivoUrls = useRef([])
  useEffect(() => () => archivoUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])
  // TODO BACKEND: usar el total real de mensajes sin leer, incluso con conversaciones paginadas.
  const sinLeer = conversaciones.reduce((total, c) => total + c.sinLeer, 0)
  const titulo = menu.find((m) => pathname === `/empresa/${m.ruta}`)?.titulo ?? 'Empresa'

  return (
    <div className="dashboard empresa-dashboard">
      <aside className="sidebar">
        <header className="marca"><Logo /></header>
        {/* TODO BACKEND: sustituir el cambio de vista de demostración por navegación según el rol autorizado. */}
        <div className="empresa-roles" aria-label="Vista de demostración"><Link to="/dashboard/explorar">Estudiante</Link><Link to="/empresa/dashboard" aria-current="page">Empresa</Link></div>
        <nav aria-label="Navegación de empresa">{menu.map(({ ruta, titulo, Icono }) => <NavLink key={ruta} to={`/empresa/${ruta}`} className={({ isActive }) => isActive ? 'activo' : ''}><Icono />{titulo}{ruta === 'mensajes' && sinLeer > 0 && <small>{sinLeer}</small>}</NavLink>)}</nav>
        {/* TODO BACKEND: mostrar nombre/logo y verificación reales; contemplar empresa no verificada. */}
        <footer className="usuario"><b>{empresa.siglas}</b><strong>{empresa.nombre}</strong><small>Empresa verificada</small></footer>
      </aside>
      <section className="area">
        {/* TODO BACKEND: sustituir el plan y la verificación fijos por los de la cuenta autenticada. */}
        <header className="barra"><h1>{titulo}</h1><ul><li>Plan Empresarial</li><li className="activo">✓ Verificado</li></ul></header>
        <section className="contenido">
          {/* TODO BACKEND: retirar este aviso cuando todas las fuentes y acciones usen datos reales. */}
          <p className="aviso-datos-ejemplo">Datos de ejemplo · Los cambios son temporales y la conexión con el backend está pendiente.</p>
          <Outlet context={{ empresa, setEmpresa, ofertas, setOfertas, candidatos, expedientes, setExpedientes, conversaciones, setConversaciones, archivoUrls }} />
        </section>
      </section>
    </div>
  )
}

