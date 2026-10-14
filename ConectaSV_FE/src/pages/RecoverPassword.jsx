import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Candado, Correo } from '../assets/icons/landing/Svg_Icons.jsx'
import PanelAuth from '../components/login_register/PanelAuth.jsx'
import { Campo } from '../components/login_register/Campo.jsx'
import '../styles/auth.css'

function RecoverPassword() {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    // TODO API: connect password recovery when the backend endpoint is available.
    setMessage('El envío de correos aún no está disponible. Inténtalo cuando el servicio esté habilitado.')
  }

  return (
    <div className="login recuperacion">
      <PanelAuth
        badge="RECUPERACIÓN SEGURA"
        titulo="Vuelve a conectar con tus oportunidades."
        texto="Recupera el acceso a tu perfil, tus aplicaciones y tus conversaciones de forma rápida y segura."
      />
      <section className="login-der">
        <div className="login-caja recuperacion-caja">
          <Link to="/login" className="recuperacion-volver">← Volver al inicio de sesión</Link>
          <div className="recuperacion-icono" aria-hidden="true"><Candado /></div>
          <h1>Recupera tu contraseña</h1>
          <p className="subtitulo">Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para crear una nueva contraseña.</p>
          <form onSubmit={handleSubmit}>
            <Campo
              id="recuperacion_correo"
              label="Correo electrónico"
              icono={<Correo />}
              type="email"
              placeholder="tu@universidad.edu.sv"
            />
            <button type="submit" className="btn-principal recuperacion-enviar">
              Enviar enlace de recuperación <span aria-hidden="true">→</span>
            </button>
            <p className="recuperacion-estado" role="status">{message}</p>
          </form>
          <p className="recuperacion-nota">Por seguridad, nunca te pediremos tu contraseña por correo.</p>
        </div>
      </section>
    </div>
  )
}

export default RecoverPassword
