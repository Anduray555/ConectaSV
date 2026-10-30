import { Link, useOutletContext } from 'react-router-dom'

export default function DashboardEmpresa() {
  const { empresa, ofertas, candidatos, resumen } = useOutletContext()
  // TODO BACKEND: solicitar totales del dashboard; no contarlos desde páginas parciales
  // de ofertas/candidatos. Entrevistas pendientes debe usar entrevistas y sus fechas reales,
  // no solo el estado de la postulación; compatibilidad debe venir del cálculo del servidor.
  const metricas = [
    ['Ofertas activas', resumen.ofertasActivas, 'Publicaciones disponibles', 'ofertas'],
    ['Aplicantes totales', resumen.aplicantes, 'En tus procesos de selección', 'candidatos'],
    ['Entrevistas pendientes', resumen.entrevistas, 'Por coordinar con candidatos', 'candidatos?estado=Entrevista'],
    ['Mensajes sin leer', resumen.sinLeer, 'De candidatos', 'mensajes'],
  ]
  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>{empresa.nombre ? `Bienvenido, ${empresa.nombre}` : 'Bienvenido'}</h2><p>Resumen de actividad de tus procesos de selección activos.</p></div></header>
    <div className="empresa-metricas">{metricas.map(([titulo, numero, detalle, ruta]) => <Link className="tarjeta empresa-metrica" to={`/empresa/${ruta}`} key={titulo}><span>{titulo}</span><strong>{numero ?? '—'}</strong><small>{detalle}</small></Link>)}</div>
    {/* TODO BACKEND: pedir aplicantes recientes ordenados por fecha de postulación y ofertas
        activas con su total real de aplicantes; slice() limita las filas visibles del resumen. */}
    <div className="empresa-resumen">
      <section className="tarjeta"><header className="empresa-seccion-titulo"><h3>Aplicantes recientes</h3><Link to="/empresa/candidatos">Ver todos →</Link></header><ul className="empresa-filas">{candidatos.slice(0, 4).map((c) => <li key={c.id}><b className="siglas">{c.siglas}</b><div><strong>{c.nombre}</strong><small>{c.carrera} · {c.universidad}</small></div><span className="empresa-match">{c.match}%<small>compatibilidad</small></span><span className={`empresa-estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span></li>)}</ul>{candidatos.length === 0 && <p className="vacio">Sin aplicantes recientes.</p>}</section>
      <section className="tarjeta"><header className="empresa-seccion-titulo"><h3>Mis ofertas</h3><Link to="/empresa/ofertas">Gestionar →</Link></header><ul className="empresa-filas">{ofertas.filter((o) => o.activa).slice(0, 3).map((o) => <li key={o.id}><div><Link to={`/empresa/candidatos?oferta=${o.id}`}>{o.titulo}</Link><small>{candidatos.filter((c) => c.ofertaId === o.id).length} aplicantes · {o.publicado}</small></div><span className="empresa-estado estado-aceptado">Activa</span></li>)}</ul>{!ofertas.some((o) => o.activa) && <p className="vacio">Sin ofertas activas.</p>}</section>
    </div>
  </section>
}
