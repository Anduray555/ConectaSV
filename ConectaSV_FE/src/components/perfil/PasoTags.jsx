import { useEffect, useState } from 'react'
import SelectorTags from './SelectorTags'
import { catalogApi } from '../../api/catalogs'
import { studentApi } from '../../api/student'
import { parseApiError } from '../../api/errors'

// Paso "Tus intereses" de Completa tu perfil.
// Como todos los pasos: guarda sus propios datos y, si todo sale bien, llama a onSiguiente().
export default function PasoTags({ user, onSiguiente, textoBoton }) {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  // Arranca con los tags que el estudiante ya tenga (por ejemplo, si vuelve a esta pantalla).
  const [seleccionados, setSeleccionados] = useState(
    () => user.student_profile?.tags?.map((tag) => tag.id) ?? [],
  )
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // La carrera del estudiante decide qué categorías van primero (ver GET /api/tags).
  const careerId = user.student_profile?.career?.id

  useEffect(() => {
    catalogApi
      .tags(careerId)
      .then(setCategorias)
      .catch((err) => setError(parseApiError(err).message))
      .finally(() => setCargando(false))
  }, [careerId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (seleccionados.length === 0) {
      setError('Elige al menos una etiqueta, o usa "Omitir por ahora".')
      return
    }

    setError(null)
    setGuardando(true)
    try {
      await studentApi.updateTags(seleccionados)
      await onSiguiente()
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err)
      // Los errores de tag_ids.0, tag_ids.1... se muestran como un solo mensaje.
      setError(Object.values(fieldErrors)[0] ?? message)
      setGuardando(false)
    }
  }

  if (cargando) return <p className="subtitulo">Cargando etiquetas…</p>

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alerta-error" role="alert">{error}</p>}

      <SelectorTags
        categorias={categorias}
        seleccionados={seleccionados}
        onChange={setSeleccionados}
      />

      <button type="submit" className="btn-principal onboarding-continuar" disabled={guardando || categorias.length === 0}>
        {guardando ? 'Guardando…' : textoBoton}
      </button>
    </form>
  )
}
