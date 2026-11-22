import { Link, useOutletContext } from 'react-router-dom'
import { IconPerfil, IconMensajes, IconProyecto } from '../../assets/icons/dashboard/Iconos'

// Tarjetas de métricas. `detalle` recibe el resumen (o null si aún no carga).
const TARJETAS = [
  {
    clave: 'usuarios',
    titulo: 'Usuarios totales',
    Icono: IconPerfil,
    detalle: (resumen) => resumen
      ? `Estudiantes y empresas · ${resumen.suspendidos} ${resumen.suspendidos === 1 ? 'suspendido' : 'suspendidos'}`
      : 'Estudiantes y empresas',
  },
  {
    clave: 'estudiantes',
    titulo: 'Estudiantes activos',
    Icono: IconPerfil,
    detalle: (resumen) => {
      if (!resumen) return 'Universidades sin cargar'
      return `De ${resumen.universidades} ${resumen.universidades === 1 ? 'universidad' : 'universidades'}`
    },
  },
  {
    clave: 'empresas',
    titulo: 'Empresas registradas',
    Icono: IconProyecto,
    detalle: () => 'Registradas en la plataforma',
  },
  {
    clave: 'tickets',
    titulo: 'Tickets de soporte',
    Icono: IconMensajes,
    // Los tickets aún no existen en el backend: resumen.tickets llega en null.
    detalle: (resumen) => resumen?.tickets != null
      ? `${resumen.ticketsAltaPrioridad ?? '—'} de alta prioridad`
      : 'Soporte aún no disponible',
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

// Un usuario de los últimos registros (GET /api/admin/summary → recent).
function RegistroReciente({ usuario }) {
  return (
    <article className="admin-pendiente">
      <h4>{usuario.nombre}</h4>
      <p>{usuario.tipo === 'empresa' ? 'Empresa' : 'Estudiante'}{usuario.detalle && ` · ${usuario.detalle}`}</p>
      <p>
        Registrado el {new Date(usuario.registro).toLocaleDateString('es-SV')}
        {usuario.estado === 'suspendido' && ' · Suspendido'}
      </p>
    </article>
  )
}

function PanelAdmin() {
  const { datos } = useOutletContext()
  const { resumen, tickets, recientes, cargado } = datos

  return (
    <div className="admin-panel">
      <header className="admin-titulo">
        <h2>Panel de Administración</h2>
        <p>Resumen general de la plataforma ConectaSV.</p>
      </header>

      {/* Totales de GET /api/admin/summary, calculados en el servidor. */}
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
              Los tickets se mostrarán cuando se conecte el servicio de soporte.
            </p>
          )}
        </section>

        <section className="tarjeta">
          <header className="admin-seccion">
            <h3>Registros recientes</h3>
            <Link to="/admin/usuarios">Gestionar →</Link>
          </header>
          {recientes.map((usuario) => (
            <RegistroReciente key={usuario.id} usuario={usuario} />
          ))}
          {!recientes.length && (
            <p className="admin-vacio">
              {cargado ? 'Todavía no hay estudiantes ni empresas registrados.' : 'Cargando registros…'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default PanelAdmin
