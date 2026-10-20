import { Link, useOutletContext } from 'react-router-dom'

export default function DashboardEmpresa() {
  const { empresa, ofertas, candidatos, conversaciones } = useOutletContext()
  // TODO BACKEND: solicitar totales del dashboard; no contarlos desde páginas parciales
  // de ofertas/candidatos. Entrevistas pendientes debe usar entrevistas y sus fechas reales,
  // no solo el estado de la postulación; compatibilidad debe venir del cálculo del servidor.
  const metricas = [
    ['Ofertas activas', ofertas.filter((o) => o.activa).length, 'Publicaciones disponibles', 'ofertas'],
    ['Aplicantes totales', candidatos.length, 'En tus procesos de selección', 'candidatos'],
    ['Entrevistas pendientes', candidatos.filter((c) => c.estado === 'Entrevista').length, 'Por coordinar con candidatos', 'candidatos?estado=Entrevista'],
    ['Mensajes sin leer', conversaciones.reduce((n, c) => n + c.sinLeer, 0), 'De candidatos', 'mensajes'],
  ]
  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>Bienvenido, {empresa.nombre}</h2><p>Resumen de actividad de tus procesos de selección activos.</p></div></header>
    <div className="empresa-metricas">{metricas.map(([titulo, numero, detalle, ruta]) => <Link className="tarjeta empresa-metrica" to={`/empresa/${ruta}`} key={titulo}><span>{titulo}</span><strong>{numero}</strong><small>{detalle}</small></Link>)}</div>
    {/* TODO BACKEND: pedir aplicantes recientes ordenados por fecha de postulación y ofertas
        activas con su total real de aplicantes; slice() solo limita los registros de ejemplo. */}
    <div className="empresa-resumen">
      <section className="tarjeta"><header className="empresa-seccion-titulo"><h3>Aplicantes recientes</h3><Link to="/empresa/candidatos">Ver todos →</Link></header><ul className="empresa-filas">{candidatos.slice(0, 4).map((c) => <li key={c.id}><b className="siglas">{c.siglas}</b><div><strong>{c.nombre}</strong><small>{c.carrera} · {c.universidad}</small></div><span className="empresa-match">{c.match}%<small>compatibilidad</small></span><span className={`empresa-estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span></li>)}</ul></section>
      <section className="tarjeta"><header className="empresa-seccion-titulo"><h3>Mis ofertas</h3><Link to="/empresa/ofertas">Gestionar →</Link></header><ul className="empresa-filas">{ofertas.filter((o) => o.activa).slice(0, 3).map((o) => <li key={o.id}><div><Link to={`/empresa/candidatos?oferta=${o.id}`}>{o.titulo}</Link><small>{candidatos.filter((c) => c.ofertaId === o.id).length} aplicantes · {o.publicado}</small></div><span className="empresa-estado estado-aceptado">Activa</span></li>)}</ul></section>
    </div>
  </section>
}
