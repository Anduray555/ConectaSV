import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PanelAuth from '../components/login_register/PanelAuth'
import { Campo, CampoPassword } from '../components/login_register/Campo'
import LogoutButton from '../components/login_register/LogoutButton'
import { Usuario, Correo, Telefono } from '../assets/icons/landing/Svg_Icons'
import useAuth from '../hooks/useAuth'
import { publicInvitationsApi } from '../api/invitations'
import { parseApiError } from '../api/errors'
import { homeFor } from '../utils/roleRoutes'
import { erroresDelFormulario, nombresParaApi } from '../utils/nombres'
import '../styles/auth.css'

// Página PÚBLICA que abre el link de invitación (/invitacion/:token).
// 1. Pide al backend los datos de la invitación (empresa, correo, vencimiento).
// 2. Si es válida, muestra el formulario; al enviarlo se crea la cuenta del reclutador
//    y queda con la sesión iniciada, igual que al registrarse.
function AceptarInvitacion() {
  const { token } = useParams()
  const { user, acceptInvitation } = useAuth()
  const navigate = useNavigate()

  const [invitacion, setInvitacion] = useState(null)
  // { status, message }: 404 = no existe/revocada, 410 = usada o vencida.
  const [noDisponible, setNoDisponible] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    publicInvitationsApi
      .show(token)
      .then(setInvitacion)
      .catch((err) => setNoDisponible({ status: err.response?.status, message: parseApiError(err).message }))
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))

    if (form.password !== form.password_confirmation) {
      setErrores({ password_confirmation: 'Las contraseñas no coinciden.' })
      return
    }

    setErrores({})
    setMensaje(null)
    setEnviando(true)
    try {
      const nuevo = await acceptInvitation(token, {
        ...nombresParaApi(form),
        email: form.email,
        phone: form.phone || null,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      navigate(homeFor(nuevo.role), { replace: true })
    } catch (err) {
      const status = err.response?.status
      const { message, fieldErrors } = parseApiError(err)
      // Si la invitación dejó de servir mientras llenaba el formulario (otra persona la usó
      // o venció), se muestra la pantalla de "no disponible".
      if (status === 404 || status === 410) {
        setNoDisponible({ status, message })
      } else {
        setErrores(erroresDelFormulario(fieldErrors))
        setMensaje(Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : message)
      }
      setEnviando(false)
    }
  }

  const empresa = invitacion?.company
  const quienInvita = invitacion?.invited_by?.first_name

  return (
    <div className="login registro">
      <PanelAuth
        badge="INVITACIÓN"
        titulo={empresa ? `Únete a ${empresa.name}` : 'Únete a tu equipo en ConectaSV'}
        texto="Como reclutador podrás publicar ofertas, revisar candidatos y conversar con estudiantes de todo El Salvador."
      />

      <section className="login-der">
        <div className="login-caja">
          {/* Alguien con sesión abrió el link: no puede crear otra cuenta encima de la suya. */}
          {user ? (
            <>
              <h1>Ya tienes una sesión abierta</h1>
              <p className="subtitulo">
                Estás conectado como <strong>{user.email}</strong>. Para aceptar esta invitación
                con una cuenta nueva, primero cierra sesión.
              </p>
              {/* Tras cerrar sesión se queda en esta misma invitación, lista para llenar. */}
              <LogoutButton className="btn-principal" redirigirA={`/invitacion/${token}`}>
                Cerrar sesión y continuar
              </LogoutButton>
              <p className="cambio"><Link to={homeFor(user.role)}>Volver a mi panel</Link></p>
            </>
          ) : noDisponible ? (
            <>
              <h1>Invitación no disponible</h1>
              <p className="subtitulo">{noDisponible.message}</p>
              <p className="cambio">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </>
          ) : !invitacion ? (
            <p className="subtitulo">Cargando invitación…</p>
          ) : (
            <>
              <div className="invitacion-empresa">
                {empresa.logo_url
                  ? <img src={empresa.logo_url} alt="" />
                  : <b>{empresa.name.slice(0, 2).toUpperCase()}</b>}
                <div>
                  <strong>{empresa.name}</strong>
                  <small>{empresa.sector}</small>
                </div>
              </div>

              <h1>Crea tu cuenta</h1>
              <p className="subtitulo">
                {quienInvita ? `${quienInvita} te invitó` : 'Te invitaron'} a unirte como reclutador.
                {/* Sin punto final: la hora en español ya termina en "p. m." */}
                La invitación vence el {new Date(invitacion.expires_at).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>

              {mensaje && <p className="alerta-error" role="alert">{mensaje}</p>}

              <form onSubmit={handleSubmit}>
                <div className="registro-nombre">
                  <div>
                    <Campo id="inv_nombres" name="nombres" label="Nombres" icono={<Usuario />}
                      placeholder="María Elena" autoComplete="given-name" error={errores.nombres} />
                  </div>
                  <div>
                    <Campo id="inv_apellidos" name="apellidos" label="Apellidos" icono={<Usuario />}
                      placeholder="González Pérez" autoComplete="family-name" error={errores.apellidos} />
                  </div>
                </div>

                {/* Si la invitación es para un correo, se muestra fijo: el backend solo acepta ese. */}
                <Campo id="inv_email" name="email" type="email" label="Correo electrónico" icono={<Correo />}
                  placeholder="tu@empresa.com.sv" autoComplete="email" error={errores.email}
                  defaultValue={invitacion.email ?? undefined} readOnly={Boolean(invitacion.email)} />

                <Campo id="inv_phone" name="phone" type="tel" label="Teléfono (opcional)" icono={<Telefono />}
                  placeholder="7777-8888" autoComplete="tel" requerido={false} error={errores.phone} />

                <CampoPassword id="inv_password" name="password" label="Contraseña"
                  placeholder="Mínimo 8 caracteres" autoComplete="new-password" error={errores.password} />
                <CampoPassword id="inv_confirmar" name="password_confirmation" label="Confirmar contraseña"
                  placeholder="Repite tu contraseña" autoComplete="new-password" error={errores.password_confirmation} />

                <button type="submit" className="btn-principal" disabled={enviando}>
                  {enviando ? 'Creando cuenta…' : 'Crear cuenta y unirme'}
                </button>
              </form>

              <p className="cambio">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default AceptarInvitacion
