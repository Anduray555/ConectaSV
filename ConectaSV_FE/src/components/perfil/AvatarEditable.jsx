import { useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { parseApiError } from '../../api/errors'
import { IMAGEN_MAX_MB, IMAGEN_TIPOS } from '../../api/images'

// Avatar grande de los perfiles (estudiante, empresa, admin).
// Muestra la imagen o, si no hay, las iniciales. Con `api` (avatarApi o logoApi) permite
// cambiarla y quitarla; sin `api` es solo de lectura (por ejemplo, un reclutador viendo el logo).
//
// Props:
//   url      -> URL actual de la imagen (o null)
//   siglas   -> texto de respaldo cuando no hay imagen
//   api      -> { upload(file), remove() } o undefined si no se puede editar
//   etiqueta -> "foto" o "logo", para los textos de los botones
export default function AvatarEditable({ url, siglas, api, etiqueta = 'foto' }) {
  const { refreshUser } = useAuth()
  const input = useRef(null)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState(null)

  // Cambiar o quitar: llama a la API y luego recarga /auth/me para que la imagen nueva
  // aparezca en TODA la app (perfil, menú de usuario...), no solo aquí.
  async function ejecutar(accion) {
    setError(null)
    setOcupado(true)
    try {
      await accion()
      await refreshUser()
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err)
      setError(fieldErrors.image ?? message)
    } finally {
      setOcupado(false)
    }
  }

  function alElegirArchivo(e) {
    const file = e.target.files[0]
    // Se limpia el input para que elegir el MISMO archivo otra vez vuelva a disparar onChange.
    e.target.value = ''
    if (!file) return

    if (!IMAGEN_TIPOS.includes(file.type)) {
      setError('La imagen debe ser PNG, JPG o WebP.')
      return
    }
    if (file.size > IMAGEN_MAX_MB * 1024 * 1024) {
      setError(`La imagen no puede pesar más de ${IMAGEN_MAX_MB} MB.`)
      return
    }

    ejecutar(() => api.upload(file))
  }

  return (
    <>
      <div className={`avatar-grande${url ? ' con-imagen' : ''}`} aria-busy={ocupado}>
        {url ? <img src={url} alt="" /> : <b>{siglas || '—'}</b>}

        {api && (
          <div className="avatar-acciones">
            {/* Textos cortos porque el avatar mide 88px; aria-label da el texto completo
                a los lectores de pantalla ("Cambiar logo", no solo "Cambiar"). */}
            <button
              type="button"
              onClick={() => input.current.click()}
              disabled={ocupado}
              aria-label={url ? `Cambiar ${etiqueta}` : `Subir ${etiqueta}`}
            >
              {ocupado ? 'Subiendo…' : url ? 'Cambiar' : 'Subir'}
            </button>
            {url && (
              <button type="button" onClick={() => ejecutar(api.remove)} disabled={ocupado} aria-label={`Quitar ${etiqueta}`}>
                Quitar
              </button>
            )}
          </div>
        )}

        {/* Input real oculto: el botón de arriba lo "presiona" con input.current.click(). */}
        {api && (
          <input
            ref={input}
            type="file"
            accept={IMAGEN_TIPOS.join(',')}
            onChange={alElegirArchivo}
            hidden
          />
        )}
      </div>

      {error && <p className="avatar-error" role="alert">{error}</p>}
    </>
  )
}
