import { useRef, useState } from 'react'
import { companyInvitationsApi } from '../../api/invitations'
import { parseApiError } from '../../api/errors'
import '../../styles/invitaciones.css'

// Formulario para invitar reclutadores: por correo o generando un link para copiar.
// Lo usan "Invita a tu equipo" (después del registro) y, más adelante, la pantalla de
// gestión de reclutadores. `onCreada` avisa al padre (por ejemplo, para recargar una lista).
//
// Cada invitación creada se muestra con su link y un botón "Copiar". El link SOLO se
// conoce aquí: el backend guarda un hash del token y no puede volver a mostrarlo.
export default function InvitarReclutadores({ onCreada }) {
  const [email, setEmail] = useState('')
  const [creadas, setCreadas] = useState([]) // las de esta visita: [{ invitation, link, email_sent }]
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function crear(conCorreo) {
    setError(null)
    setEnviando(true)
    try {
      const resultado = await companyInvitationsApi.create(conCorreo ? email : null)
      setCreadas((actuales) => [resultado, ...actuales]) // la más nueva arriba
      if (conCorreo) setEmail('')
      onCreada?.(resultado.invitation)
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err)
      setError(fieldErrors.email ?? message)
    } finally {
      setEnviando(false)
    }
  }

  function enviarPorCorreo(e) {
    e.preventDefault()
    crear(true)
  }

  return (
    <div className="invitar">
      <form className="invitar-form" onSubmit={enviarPorCorreo}>
        <label htmlFor="invitar_email">Invitar por correo</label>
        <div className="invitar-fila">
          <input
            id="invitar_email"
            type="email"
            required
            placeholder="reclutador@empresa.com.sv"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'invitar_error' : undefined}
          />
          <button type="submit" className="invitar-btn" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar invitación'}
          </button>
        </div>
      </form>

      <div className="invitar-separador"><span>o</span></div>

      <button type="button" className="invitar-btn invitar-btn-secundario" onClick={() => crear(false)} disabled={enviando}>
        Generar link para compartir
      </button>
      <p className="invitar-ayuda">
        Cada link sirve para <strong>una sola persona</strong> y vence en 24 horas.
      </p>

      {error && <p className="invitar-error" id="invitar_error" role="alert">{error}</p>}

      {creadas.length > 0 && (
        <ul className="invitar-lista" aria-label="Invitaciones creadas">
          {creadas.map(({ invitation, link, email_sent }) => (
            <InvitacionCreada key={invitation.id} invitation={invitation} link={link} emailSent={email_sent} />
          ))}
        </ul>
      )}
    </div>
  )
}

function InvitacionCreada({ invitation, link, emailSent }) {
  const campo = useRef(null)
  // null | 'copiado' | 'manual' (el navegador no dejó copiar: se pide Ctrl+C)
  const [copia, setCopia] = useState(null)

  async function copiar() {
    let ok // lo define el try o el catch
    try {
      // API moderna. Solo funciona en "contextos seguros" (https o localhost) y si el
      // navegador da permiso; algunos (o algunas extensiones) lo bloquean.
      await navigator.clipboard.writeText(link)
      ok = true
    } catch {
      // Plan B: el método antiguo, seleccionar el texto y "copiar".
      campo.current.select()
      ok = document.execCommand?.('copy') ?? false
    }

    if (!ok) campo.current.select() // queda seleccionado para que el usuario pulse Ctrl+C
    setCopia(ok ? 'copiado' : 'manual')
    setTimeout(() => setCopia(null), ok ? 2000 : 5000)
  }

  let estado
  if (!invitation.email) estado = 'Copia este link y compártelo con quien quieras invitar.'
  else if (emailSent) estado = `Correo enviado a ${invitation.email}. También puedes copiar el link.`
  else estado = `No se pudo enviar el correo a ${invitation.email}. Copia el link y compártelo tú.`

  return (
    <li className={`invitar-item${invitation.email && !emailSent ? ' con-aviso' : ''}`}>
      <strong>{invitation.email ?? 'Link sin correo'}</strong>
      <small>{estado}</small>
      <div className="invitar-fila">
        {/* readOnly + onFocus select: un clic selecciona todo el link, por si se copia a mano. */}
        <input ref={campo} type="text" value={link} readOnly onFocus={(e) => e.target.select()} aria-label="Link de invitación" />
        <button type="button" className="invitar-btn invitar-btn-secundario" onClick={copiar}>
          {copia === 'copiado' ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      {copia === 'manual' && (
        <small role="status">Tu navegador no permitió copiar automáticamente: el link quedó seleccionado, pulsa Ctrl+C.</small>
      )}
    </li>
  )
}
