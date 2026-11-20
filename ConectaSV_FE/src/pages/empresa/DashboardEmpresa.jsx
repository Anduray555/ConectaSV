import { Link, useOutletContext } from 'react-router-dom'

function DashboardEmpresa() {
  const { empresa, ofertas, candidatos, resumen } = useOutletContext()

  // TODO BACKEND: solicitar totales del dashboard; no contarlos desde páginas parciales
  // de ofertas/candidatos. Entrevistas pendientes debe usar entrevistas y sus fechas reales,
  // no solo el estado de la postulación; compatibilidad debe venir del cálculo del servidor.
  const metricas = [
    { titulo: 'Ofertas activas', numero: resumen.ofertasActivas, detalle: 'Publicaciones disponibles', ruta: 'ofertas' },
    { titulo: 'Aplicantes totales', numero: resumen.aplicantes, detalle: 'En tus procesos de selección', ruta: 'candidatos' },
    { titulo: 'Entrevistas pendientes', numero: resumen.entrevistas, detalle: 'Por coordinar con candidatos', ruta: 'candidatos?estado=Entrevista' },
    { titulo: 'Mensajes sin leer', numero: resumen.sinLeer, detalle: 'De candidatos', ruta: 'mensajes' },
  ]

  // TODO BACKEND: pedir aplicantes recientes ordenados por fecha de postulación y ofertas
  // activas con su total real de aplicantes; slice() limita las filas visibles del resumen.
  const recientes = candidatos.slice(0, 4)
  const ofertasActivas = ofertas.filter((o) => o.activa)
  const aplicantesDe = (ofertaId) => candidatos.filter((c) => c.ofertaId === ofertaId).length

  return (
    <section className="empresa-vista">
      <header className="empresa-encabezado">
        <div>
          <h2>{empresa.nombre ? `Bienvenido, ${empresa.nombre}` : 'Bienvenido'}</h2>
          <p>Resumen de actividad de tus procesos de selección activos.</p>
        </div>
      </header>

      <div className="empresa-metricas">
        {metricas.map(({ titulo, numero, detalle, ruta }) => (
          <Link className="tarjeta empresa-metrica" to={`/empresa/${ruta}`} key={titulo}>
            <span>{titulo}</span>
            <strong>{numero ?? '—'}</strong>
            <small>{detalle}</small>
          </Link>
        ))}
      </div>

      <div className="empresa-resumen">
        <section className="tarjeta">
          <header className="empresa-seccion-titulo">
            <h3>Aplicantes recientes</h3>
            <Link to="/empresa/candidatos">Ver todos →</Link>
          </header>
          <ul className="empresa-filas">
            {recientes.map((c) => (
              <li key={c.id}>
                <b className="siglas">{c.siglas}</b>
                <div>
                  <strong>{c.nombre}</strong>
                  <small>{c.carrera} · {c.universidad}</small>
                </div>
                <span className="empresa-match">{c.match}%<small>compatibilidad</small></span>
                <span className={`empresa-estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span>
              </li>
            ))}
          </ul>
          {candidatos.length === 0 && <p className="vacio">Sin aplicantes recientes.</p>}
        </section>

        <section className="tarjeta">
          <header className="empresa-seccion-titulo">
            <h3>Mis ofertas</h3>
            <Link to="/empresa/ofertas">Gestionar →</Link>
          </header>
          <ul className="empresa-filas">
            {ofertasActivas.slice(0, 3).map((o) => (
              <li key={o.id}>
                <div>
                  <Link to={`/empresa/candidatos?oferta=${o.id}`}>{o.titulo}</Link>
                  <small>{aplicantesDe(o.id)} aplicantes · {o.publicado}</small>
                </div>
                <span className="empresa-estado estado-aceptado">Activa</span>
              </li>
            ))}
          </ul>
          {ofertasActivas.length === 0 && <p className="vacio">Sin ofertas activas.</p>}
        </section>
      </div>
    </section>
  )
}

export default DashboardEmpresa
