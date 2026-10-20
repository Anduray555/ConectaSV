import { useOutletContext, useSearchParams } from 'react-router-dom'

export default function CandidatosEmpresa() {
  const { candidatos, ofertas } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const estado = params.get('estado') ?? ''
  const ofertaId = params.get('oferta') ?? ''
  // TODO BACKEND: consultar postulaciones de esta empresa con oferta/estado/paginación.
  // Conservar filtros en la URL, validar sus valores y mostrar el total filtrado del servidor.
  // Adaptar los códigos de estado a estas etiquetas y las clases visuales correspondientes.
  // El porcentaje de compatibilidad, habilidades y datos académicos deben venir de la API.
  const lista = candidatos.filter((c) => (!estado || c.estado === estado) && (!ofertaId || c.ofertaId === ofertaId))
  function filtrar(clave, valor) { const nuevos = new URLSearchParams(params); if (valor) nuevos.set(clave, valor); else nuevos.delete(clave); setParams(nuevos) }
  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>Candidatos</h2><p>{lista.length} de {candidatos.length} aplicantes</p></div></header>
    <div className="empresa-filtros"><label>Oferta<select value={ofertaId} onChange={(e) => filtrar('oferta', e.target.value)}><option value="">Todas las ofertas</option>{ofertas.map((o) => <option value={o.id} key={o.id}>{o.titulo}</option>)}</select></label>
      <div className="filtros" aria-label="Estado del candidato">{[['', 'Todos'], ['Pendiente', 'Pendientes'], ['Entrevista', 'Entrevista'], ['Aceptado', 'Aceptados'], ['Rechazado', 'Rechazados']].map(([valor, label]) => <button key={valor} className={estado === valor ? 'activo' : ''} aria-pressed={estado === valor} onClick={() => filtrar('estado', valor)}>{label}</button>)}</div>
    </div>
    {/* TODO BACKEND: incluir la oferta relacionada en la respuesta o consultarla por id;
        su ausencia en una página local de ofertas no significa que esté archivada. */}
    {lista.map((c) => { const oferta = ofertas.find((o) => o.id === c.ofertaId); return <article className="tarjeta empresa-candidato" key={c.id}><b className="siglas">{c.siglas}</b><div><h3>{c.nombre}</h3><p>{c.carrera} · {c.universidad}</p><p className="empresa-candidato-oferta">{oferta?.titulo ?? 'Oferta archivada'}{oferta && ` · ${oferta.tipo}`}</p><ul className="etiquetas">{c.habilidades.map((h) => <li key={h}>{h}</li>)}</ul></div><div className="empresa-candidato-estado"><span className={`empresa-estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span><span className="empresa-match">{c.match}%<small>compatibilidad</small></span></div></article> })}
    {lista.length === 0 && <p className="vacio">No hay candidatos con estos filtros.</p>}
  </section>
}
