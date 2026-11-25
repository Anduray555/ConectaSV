import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PanelAuth from '../components/login_register/PanelAuth'
import InvitarReclutadores from '../components/empresa/InvitarReclutadores'
import useAuth from '../hooks/useAuth'
import { companyInvitationsApi } from '../api/invitations'
import { parseApiError } from '../api/errors'
import { homeFor } from '../utils/roleRoutes'
import { rutaOnboarding, RUTA_ONBOARDING_EMPRESA } from '../utils/onboarding'
import '../styles/auth.css'

// "Invita a tu equipo": se muestra UNA vez al owner después de registrar la empresa
// (igual que "Completa tu perfil" a los estudiantes). Invitar es opcional.
function InvitarEquipo() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [invitadas, setInvitadas] = useState(0)
  const [error, setError] = useState(null)
  const [terminando, setTerminando] = useState(false)

  // Si ya pasó por aquí, o es reclutador, esta pantalla no le corresponde.
  if (rutaOnboarding(user) !== RUTA_ONBOARDING_EMPRESA) return <Navigate to={homeFor(user.role)} replace />

  async function finalizar() {
    setError(null)
    setTerminando(true)
    try {
      await companyInvitationsApi.completeOnboarding()
      // onboarded_at deja de ser null en toda la app: el guardia ya no nos regresa aquí.
      await refreshUser()
      navigate(homeFor(user.role), { replace: true })
    } catch (err) {
      setError(parseApiError(err).message)
      setTerminando(false)
    }
  }

  const empresa = user.company_member?.company?.name

  return (
    <div className="login registro onboarding">
      <PanelAuth
        badge="ÚLTIMO PASO"
        titulo={`¡Bienvenido, ${user.first_name}!`}
        texto={`${empresa ?? 'Tu empresa'} ya está en ConectaSV. Invita a tu equipo de reclutamiento para publicar ofertas y revisar candidatos juntos.`}
      />

      <section className="login-der">
        <div className="login-caja">
          <h1>Invita a tu equipo</h1>
          <p className="subtitulo">
            Los reclutadores que invites podrán crear su cuenta y unirse a {empresa ?? 'tu empresa'}.
            Podrás gestionarlos después desde el panel.
          </p>

          {error && <p className="alerta-error" role="alert">{error}</p>}

          <InvitarReclutadores onCreada={() => setInvitadas((n) => n + 1)} />

          <button type="button" className="btn-principal onboarding-continuar" onClick={finalizar} disabled={terminando}>
            {terminando ? 'Un momento…' : 'Ir a mi panel'}
          </button>
          {invitadas === 0 && (
            <p className="onboarding-nota">¿Prefieres hacerlo después? Puedes continuar sin invitar a nadie.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default InvitarEquipo
