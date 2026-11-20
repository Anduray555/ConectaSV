import { Link, useOutletContext } from 'react-router-dom'
import { IconPerfil, IconMensajes, IconProyecto } from '../../assets/icons/dashboard/Iconos'

// Tarjetas de métricas. `detalle` recibe el resumen (o null si aún no carga).
const TARJETAS = [
  {
    clave: 'usuarios',
    titulo: 'Usuarios totales',
    Icono: IconPerfil,
    detalle: () => 'Estudiantes y empresas',
  },
  {
    clave: 'estudiantes',
    titulo: 'Estudiantes activos',
    Icono: IconPerfil,
    detalle: (resumen) => resumen
      ? `De ${resumen.universidades ?? '—'} universidades`
      : 'Universidades sin cargar',
  },
  {
    clave: 'empresas',
    titulo: 'Empresas registradas',
    Icono: IconProyecto,
    detalle: (resumen) => resumen
      ? `${resumen.empresasPendientes ?? '—'} pendientes de verificar`
      : 'Verificaciones sin cargar',
  },
  {
    clave: 'tickets',
    titulo: 'Tickets de soporte',
    Icono: IconMensajes,
    detalle: (resumen) => resumen
      ? `${resumen.ticketsAltaPrioridad ?? '—'} de alta prioridad`
      : 'Prioridades sin cargar',
  },
]

function TicketReciente({ ticket }) {
  return (
    <Link className="admin-fila-ticket" to={`/admin/soporte?ticket=${encodeURIComponent(ticket.id)}`}>
      <div>
        <strong>{ticket.asunto}</strong>
        <p>{ticket.nombre} · {ticket.tipo}</p>
      </div>
      <span className="admin-insignia">{ticket.estado}</span>
    </Link>
  )
}

function UsuarioPendiente({ usuario, accion, ocupado }) {
  return (
    <article className="admin-pendiente">
      <h4>{usuario.nombre}</h4>
      <p>{usuario.detalle}</p>
      <p>{usuario.motivoRevision}</p>
      <div className="admin-acciones">
        <button disabled={ocupado} onClick={() => accion('aprobarUsuario', usuario.id)}>Aprobar</button>
        <button disabled={ocupado} onClick={() => accion('rechazarUsuario', usuario.id)}>Rechazar</button>
      </div>
    </article>
  )
}

function PanelAdmin() {
  const { datos, accion, ocupado } = useOutletContext()
  const { resumen, tickets, pendientes, cargado } = datos

  return (
    <div className="admin-panel">
      <header className="admin-titulo">
        <h2>Panel de Administración</h2>
        <p>Resumen general de la plataforma ConectaSV.</p>
      </header>

      {/* TODO BACKEND: métricas agregadas del servidor, no calculadas sobre páginas parciales. */}
      <div className="admin-metricas">
        {TARJETAS.map(({ clave, titulo, detalle, Icono }) => (
          <article className="tarjeta" key={clave}>
            <span className="admin-metrica-icono"><Icono /></span>
            <strong>{resumen?.[clave] ?? '—'}</strong>
            <h3>{titulo}</h3>
            <p>{detalle(resumen)}</p>
          </article>
        ))}
      </div>

      <div className="admin-panel-columnas">
        <section className="tarjeta">
          <header className="admin-seccion">
            <h3>Tickets recientes de soporte</h3>
            <Link to="/admin/soporte">Ver todos →</Link>
          </header>
          {tickets.slice(0, 4).map((ticket) => (
            <TicketReciente key={ticket.id} ticket={ticket} />
          ))}
          {!tickets.length && (
            <p className="admin-vacio">
              {cargado ? 'No hay tickets recientes.' : 'Los tickets se mostrarán cuando se conecte el servicio.'}
            </p>
          )}
        </section>

        <section className="tarjeta">
          <header className="admin-seccion">
            <h3>Usuarios pendientes</h3>
            <Link to="/admin/usuarios?estado=pendiente">Gestionar →</Link>
          </header>
          {/* TODO BACKEND: consultar cola de verificación y revisar documentos antes de aprobar. */}
          {pendientes.map((usuario) => (
            <UsuarioPendiente key={usuario.id} usuario={usuario} accion={accion} ocupado={ocupado} />
          ))}
          {!pendientes.length && (
            <p className="admin-vacio">
              {cargado ? 'No hay usuarios pendientes de revisión.' : 'Las verificaciones se mostrarán cuando se conecte el servicio.'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default PanelAdmin
