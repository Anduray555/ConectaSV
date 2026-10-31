import { Link, useOutletContext } from 'react-router-dom'
import { IconPerfil, IconMensajes, IconProyecto } from '../../assets/icons/dashboard/Iconos'

export default function PanelAdmin() {
  const { datos, accion, ocupado } = useOutletContext()
  const { resumen, tickets, pendientes, cargado } = datos
  const tarjetas = [
    { clave: 'usuarios', titulo: 'Usuarios totales', detalle: 'Estudiantes y empresas', Icono: IconPerfil },
    { clave: 'estudiantes', titulo: 'Estudiantes activos', detalle: resumen ? `De ${resumen.universidades ?? '—'} universidades` : 'Universidades sin cargar', Icono: IconPerfil },
    { clave: 'empresas', titulo: 'Empresas registradas', detalle: resumen ? `${resumen.empresasPendientes ?? '—'} pendientes de verificar` : 'Verificaciones sin cargar', Icono: IconProyecto },
    { clave: 'tickets', titulo: 'Tickets de soporte', detalle: resumen ? `${resumen.ticketsAltaPrioridad ?? '—'} de alta prioridad` : 'Prioridades sin cargar', Icono: IconMensajes },
  ]
  return (
    <div className="admin-panel">
      <header className="admin-titulo"><h2>Panel de Administración</h2><p>Resumen general de la plataforma ConectaSV.</p></header>
      {/* TODO BACKEND: métricas agregadas del servidor, no calculadas sobre páginas parciales. */}
      <div className="admin-metricas">{tarjetas.map(({ clave, titulo, detalle, Icono }) => <article className="tarjeta" key={clave}><span className="admin-metrica-icono"><Icono /></span><strong>{resumen?.[clave] ?? '—'}</strong><h3>{titulo}</h3><p>{detalle}</p></article>)}</div>
      <div className="admin-panel-columnas">
        <section className="tarjeta"><header className="admin-seccion"><h3>Tickets recientes de soporte</h3><Link to="/admin/soporte">Ver todos →</Link></header>
          {tickets.slice(0, 4).map((ticket) => <Link className="admin-fila-ticket" key={ticket.id} to={`/admin/soporte?ticket=${encodeURIComponent(ticket.id)}`}><div><strong>{ticket.asunto}</strong><p>{ticket.nombre} · {ticket.tipo}</p></div><span className="admin-insignia">{ticket.estado}</span></Link>)}
          {!tickets.length && <p className="admin-vacio">{cargado ? 'No hay tickets recientes.' : 'Los tickets se mostrarán cuando se conecte el servicio.'}</p>}
        </section>
        <section className="tarjeta"><header className="admin-seccion"><h3>Usuarios pendientes</h3><Link to="/admin/usuarios?estado=pendiente">Gestionar →</Link></header>
          {/* TODO BACKEND: consultar cola de verificación y revisar documentos antes de aprobar. */}
          {pendientes.map((usuario) => <article className="admin-pendiente" key={usuario.id}><h4>{usuario.nombre}</h4><p>{usuario.detalle}</p><p>{usuario.motivoRevision}</p><div className="admin-acciones"><button disabled={ocupado} onClick={() => accion('aprobarUsuario', usuario.id)}>Aprobar</button><button disabled={ocupado} onClick={() => accion('rechazarUsuario', usuario.id)}>Rechazar</button></div></article>)}
          {!pendientes.length && <p className="admin-vacio">{cargado ? 'No hay usuarios pendientes de revisión.' : 'Las verificaciones se mostrarán cuando se conecte el servicio.'}</p>}
        </section>
      </div>
    </div>
  )
}
