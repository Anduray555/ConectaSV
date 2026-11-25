import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PanelAuth from '../components/login_register/PanelAuth'
import PasoTags from '../components/perfil/PasoTags'
import { Check } from '../assets/icons/landing/Svg_Icons'
import useAuth from '../hooks/useAuth'
import { studentApi } from '../api/student'
import { parseApiError } from '../api/errors'
import { homeFor } from '../utils/roleRoutes'
import { necesitaOnboarding } from '../utils/onboarding'
import '../styles/auth.css'

// Pasos de la pantalla. Para agregar uno nuevo (por ejemplo, datos de servicio social):
//   1. Crea su componente en components/perfil/, que guarde sus datos y luego llame a onSiguiente().
//   2. Agrégalo aquí. Con `mostrar` decides a qué estudiantes les aparece.
const PASOS = [
  {
    id: 'tags',
    etiqueta: 'Intereses',
    titulo: 'Tus intereses',
    subtitulo: 'Elige las etiquetas que mejor te describen. Las usamos para recomendarte ofertas y calcular tu compatibilidad.',
    mostrar: () => true,
    Componente: PasoTags,
  },
  // Ejemplo futuro:
  // {
  //   id: 'servicio-social',
  //   etiqueta: 'Servicio social',
  //   titulo: 'Tu servicio social',
  //   subtitulo: '...',
  //   mostrar: (user) => user.student_profile.interests.some((i) => i.name === 'Servicio Social'),
  //   Componente: PasoServicioSocial,
  // },
]

function CompletarPerfil() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [indice, setIndice] = useState(0)
  const [error, setError] = useState(null)
  const [terminando, setTerminando] = useState(false)

  // Si ya la completó (o no es estudiante), esta pantalla no tiene nada que hacer.
  if (!necesitaOnboarding(user)) return <Navigate to={homeFor(user.role)} replace />

  const pasos = PASOS.filter((paso) => paso.mostrar(user))
  const paso = pasos[indice]
  const esUltimo = indice === pasos.length - 1

  // Se llama al terminar el último paso o al pulsar "Omitir por ahora".
  async function finalizar() {
    setError(null)
    setTerminando(true)
    try {
      await studentApi.completeOnboarding()
      // Recargar el usuario hace que onboarded_at deje de ser null en toda la app,
      // así el guardia del dashboard ya no nos regresa aquí.
      await refreshUser()
      navigate(homeFor(user.role), { replace: true })
    } catch (err) {
      setError(parseApiError(err).message)
      setTerminando(false)
    }
  }

  async function siguiente() {
    if (esUltimo) await finalizar()
    else setIndice((actual) => actual + 1)
  }

  const { Componente } = paso

  return (
    <div className="login registro onboarding">
      <PanelAuth
        badge="ÚLTIMO PASO"
        titulo={`¡Bienvenido, ${user.first_name}!`}
        texto="Completa tu perfil para que podamos mostrarte las oportunidades que más encajan contigo."
      />

      <section className="login-der">
        <div className="login-caja">
          <h1>{paso.titulo}</h1>
          <p className="subtitulo">{paso.subtitulo}</p>

          {/* El indicador solo tiene sentido si hay más de un paso. */}
          {pasos.length > 1 && (
            <div className="pasos">
              {pasos.map((p, i) => (
                <div key={p.id} className={`paso ${i === indice ? 'activo' : i < indice ? 'completo' : ''}`}>
                  <span>{i < indice ? <Check /> : i + 1}</span> {p.etiqueta}
                </div>
              ))}
            </div>
          )}

          {error && <p className="alerta-error" role="alert">{error}</p>}

          {/* key={paso.id}: al cambiar de paso, React crea el componente desde cero. */}
          <Componente
            key={paso.id}
            user={user}
            onSiguiente={siguiente}
            textoBoton={esUltimo ? 'Terminar' : 'Continuar →'}
          />

          <button type="button" className="onboarding-omitir" onClick={finalizar} disabled={terminando}>
            {terminando ? 'Un momento…' : 'Omitir por ahora'}
          </button>
          <p className="onboarding-nota">Podrás cambiar todo esto después desde Mi Perfil.</p>
        </div>
      </section>
    </div>
  )
}

export default CompletarPerfil
