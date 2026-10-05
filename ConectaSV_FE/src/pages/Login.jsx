import { Link } from "react-router-dom"
import { Google, Microsoft, Correo } from "../assets/icons/landing/Svg_Icons.jsx"
import PanelAuth from "../components/login_register/PanelAuth.jsx"
import { Campo, CampoPassword } from "../components/login_register/Campo.jsx"
import "../styles/auth.css"

function Login() {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="login">
      <PanelAuth
        badge="¡BIENVENIDO DE NUEVO!"
        titulo="Tu carrera te está esperando."
        texto="Miles de oportunidades de empleo, práctica y servicio social publicadas por las mejores empresas de El Salvador."
      />

      <section className="login-der">
        <div className="login-caja">
          <h1>Bienvenido de nuevo</h1>
          <p className="subtitulo">Inicia sesión para continuar a tu cuenta.</p>

          <div className="social-botones">
            <button type="button" onClick={()=> navigate('/dashboard')}><Google /> Google</button>
            <button type="button"><Microsoft /> Microsoft</button>
          </div>

          <div className="divisor"><span>o con correo</span></div>

          <form onSubmit={handleSubmit}>
            <Campo
              id="login_correo"
              label="Correo electrónico"
              icono={<Correo />}
              type="email"
              placeholder="tu@universidad.edu.sv"
            />
            <CampoPassword
              id="login_password"
              label="Contraseña"
              placeholder="••••••••"
            />
            <Link to="/recuperar-password" className="olvido">
              ¿Olvidaste tu contraseña?
            </Link>
            <button type="submit" className="btn-principal">Iniciar sesión</button>
          </form>

          <p className="cambio">
            ¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login