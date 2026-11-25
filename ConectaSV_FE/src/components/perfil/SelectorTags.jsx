import { useMemo, useState } from 'react'
import '../../styles/tags.css'

// Selector de tags con filtro por categoría y buscador.
// Es "controlado": no guarda los elegidos, los recibe en `seleccionados` y avisa con `onChange`.
// Así lo puede usar cualquier pantalla (Completa tu perfil, Mi Perfil, filtros de ofertas...)
// y cada una decide cuándo guardar.
//
// Props:
//   categorias    -> respuesta de GET /api/tags:
//                    [{ id, name, is_general, matches_career, tags: [{ id, name }] }]
//   seleccionados -> array de ids elegidos
//   onChange      -> recibe el nuevo array de ids
//   max           -> máximo permitido (el backend también lo valida)

// "Programación" y "programacion" deben coincidir: quitamos tildes y mayúsculas.
const normalizar = (texto) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Recomendadas = las del área de la carrera + las generales.
const esRecomendada = (categoria) => categoria.matches_career || categoria.is_general

// Valores especiales del combo (las categorías usan su id numérico convertido a texto).
const RECOMENDADAS = 'recomendadas'
const TODAS = 'todas'

export default function SelectorTags({ categorias, seleccionados, onChange, max = 10 }) {
  // Lo elegido en el combo: RECOMENDADAS, TODAS o el id de una categoría (como texto,
  // porque el value de un <select> siempre es texto).
  const [filtro, setFiltro] = useState(RECOMENDADAS)
  const [busqueda, setBusqueda] = useState('')

  // id -> tag, para pintar los elegidos aunque su categoría no esté visible.
  // useMemo: solo se recalcula si cambian las categorías, no en cada tecla del buscador.
  const tagsPorId = useMemo(
    () => new Map(categorias.flatMap((categoria) => categoria.tags.map((tag) => [tag.id, tag]))),
    [categorias],
  )

  // Grupos del combo. El backend ya manda las categorías en este orden.
  const deMiCarrera = categorias.filter((categoria) => categoria.matches_career)
  const generales = categorias.filter((categoria) => !categoria.matches_career && categoria.is_general)
  const otras = categorias.filter((categoria) => !esRecomendada(categoria))

  const lleno = seleccionados.length >= max
  const termino = normalizar(busqueda.trim())

  // Qué se muestra abajo:
  //  - con búsqueda: los tags que coinciden, en TODAS las categorías (para no esconder resultados)
  //  - si no, según el combo: recomendadas, todas o una sola categoría
  let grupos
  if (termino) {
    grupos = categorias
      .map((categoria) => ({
        ...categoria,
        tags: categoria.tags.filter((tag) => normalizar(tag.name).includes(termino)),
      }))
      .filter((categoria) => categoria.tags.length > 0)
  } else if (filtro === RECOMENDADAS) {
    grupos = [...deMiCarrera, ...generales]
  } else if (filtro === TODAS) {
    grupos = categorias
  } else {
    grupos = categorias.filter((categoria) => String(categoria.id) === filtro)
  }

  function alternar(id) {
    if (seleccionados.includes(id)) {
      onChange(seleccionados.filter((elegido) => elegido !== id))
    } else if (!lleno) {
      onChange([...seleccionados, id])
    }
  }

  // Un <optgroup> por grupo; si un grupo está vacío no se pinta.
  const opciones = (etiqueta, lista) =>
    lista.length > 0 && (
      <optgroup label={etiqueta}>
        {lista.map((categoria) => (
          <option key={categoria.id} value={String(categoria.id)}>
            {categoria.name}
          </option>
        ))}
      </optgroup>
    )

  return (
    <div className="selector-tags">
      {/* ---------- Elegidos: siempre visibles, se quitan con × ---------- */}
      <section className="selector-tags-elegidos" aria-label="Etiquetas seleccionadas">
        <header>
          <strong>Tus etiquetas</strong>
          <span aria-live="polite">{seleccionados.length} de {max}</span>
        </header>
        {seleccionados.length === 0 ? (
          <p>Aún no eliges ninguna. Toca una etiqueta de abajo para agregarla.</p>
        ) : (
          <ul>
            {seleccionados.map((id) => (
              <li key={id}>
                <button type="button" className="tag-elegido" onClick={() => alternar(id)}>
                  {tagsPorId.get(id)?.name ?? 'Etiqueta'}
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">(quitar)</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- Combo de categoría + buscador ---------- */}
      <div className="selector-tags-controles">
        <select
          className="selector-tags-combo"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Categoría"
          // Mientras se busca, el combo no aplica (la búsqueda recorre todas las categorías).
          disabled={Boolean(termino)}
        >
          <option value={RECOMENDADAS}>Recomendadas para ti</option>
          <option value={TODAS}>Todas las categorías</option>
          {opciones('De tu carrera', deMiCarrera)}
          {opciones('Generales', generales)}
          {opciones('Otras áreas', otras)}
        </select>

        <input
          type="search"
          className="selector-tags-buscar"
          placeholder="Buscar (ej. React, Inglés)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar etiquetas"
        />
      </div>

      {/* ---------- Tags ---------- */}
      <div className="selector-tags-lista">
        {grupos.length === 0 && <p className="selector-tags-vacio">No hay etiquetas que coincidan con “{busqueda}”.</p>}

        {grupos.map((categoria) => (
          <fieldset key={categoria.id} className="selector-tags-grupo">
            <legend>{categoria.name}</legend>
            <div className="selector-tags-opciones">
              {categoria.tags.map((tag) => {
                const activo = seleccionados.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className="tag-chip"
                    // aria-pressed: los lectores de pantalla anuncian si está activado o no.
                    aria-pressed={activo}
                    disabled={!activo && lleno}
                    onClick={() => alternar(tag.id)}
                  >
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
