import { useOutletContext, useSearchParams } from 'react-router-dom'

const FILTROS_ESTADO = [
  ['', 'Todos'],
  ['Pendiente', 'Pendientes'],
  ['Entrevista', 'Entrevista'],
  ['Aceptado', 'Aceptados'],
  ['Rechazado', 'Rechazados'],
]

function TarjetaCandidato({ candidato, oferta }) {
  return (
    <article className="tarjeta empresa-candidato">
      <b className="siglas">{candidato.siglas}</b>

      <div>
        <h3>{candidato.nombre}</h3>
        <p>{candidato.carrera} · {candidato.universidad}</p>
        <p className="empresa-candidato-oferta">
          {oferta?.titulo ?? 'Oferta archivada'}
          {oferta && ` · ${oferta.tipo}`}
        </p>
        <ul className="etiquetas">
          {candidato.habilidades.map((h) => <li key={h}>{h}</li>)}
        </ul>
      </div>

      <div className="empresa-candidato-estado">
        <span className={`empresa-estado estado-${candidato.estado.toLowerCase()}`}>{candidato.estado}</span>
        <span className="empresa-match">{candidato.match}%<small>compatibilidad</small></span>
      </div>
    </article>
  )
}

function CandidatosEmpresa() {
  const { candidatos, ofertas } = useOutletContext()
  const [params, setParams] = useSearchParams()

  const estado = params.get('estado') ?? ''
  const ofertaId = params.get('oferta') ?? ''

  // TODO BACKEND: consultar postulaciones de esta empresa con oferta/estado/paginación.
  // Conservar filtros en la URL, validar sus valores y mostrar el total filtrado del servidor.
  // Adaptar los códigos de estado a estas etiquetas y las clases visuales correspondientes.
  // El porcentaje de compatibilidad, habilidades y datos académicos deben venir de la API.
  const lista = candidatos.filter((c) =>
    (!estado || c.estado === estado) && (!ofertaId || c.ofertaId === ofertaId),
  )

  // Guarda el filtro en la URL; un valor vacío lo quita.
  function filtrar(clave, valor) {
    const nuevos = new URLSearchParams(params)
    if (valor) nuevos.set(clave, valor)
    else nuevos.delete(clave)
    setParams(nuevos)
  }

  return (
    <section className="empresa-vista">
      <header className="empresa-encabezado">
        <div>
          <h2>Candidatos</h2>
          <p>{lista.length} de {candidatos.length} aplicantes</p>
        </div>
      </header>

      <div className="empresa-filtros">
        <label>
          Oferta
          <select value={ofertaId} onChange={(e) => filtrar('oferta', e.target.value)}>
            <option value="">Todas las ofertas</option>
            {ofertas.map((o) => <option value={o.id} key={o.id}>{o.titulo}</option>)}
          </select>
        </label>

        <div className="filtros" aria-label="Estado del candidato">
          {FILTROS_ESTADO.map(([valor, label]) => (
            <button
              key={valor}
              className={estado === valor ? 'activo' : ''}
              aria-pressed={estado === valor}
              onClick={() => filtrar('estado', valor)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TODO BACKEND: incluir la oferta relacionada en la respuesta o consultarla por id;
          su ausencia en una página local de ofertas no significa que esté archivada. */}
      {lista.map((c) => (
        <TarjetaCandidato key={c.id} candidato={c} oferta={ofertas.find((o) => o.id === c.ofertaId)} />
      ))}

      {lista.length === 0 && <p className="vacio">No hay candidatos con estos filtros.</p>}
    </section>
  )
}

export default CandidatosEmpresa
