import { Link, useNavigate } from "react-router-dom"
import { Google, Microsoft, Correo } from "../assets/icons/landing/Svg_Icons.jsx"
import PanelAuth from "../components/login_register/PanelAuth.jsx"
import { Campo, CampoPassword } from "../components/login_register/Campo.jsx"
import useAuth from "../hooks/useAuth.js"
import { useState } from "react"
import { parseApiError } from '../api/errors';
import { homeFor } from "../utils/roleRoutes.js"
import "../styles/auth.css"

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = Object.fromEntries(new FormData(e.currentTarget));

    setError(null);
    setSubmitting(true);

    try {
      const user = await login(credentials);
      navigate(homeFor(user.role), { replace: true });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

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
            <button type="button" onClick={()=> navigate('/dashboard/explorar')}><Google /> Google</button>
            <button type="button"><Microsoft /> Microsoft</button>
          </div>

          <div className="divisor"><span>o con correo</span></div>

          <form onSubmit={handleSubmit}>
            <Campo
              id="login_correo"
              name="email"
              label="Correo electrónico"
              icono={<Correo />}
              type="email"
              placeholder="tu@universidad.edu.sv"
            />
            <CampoPassword
              id="login_password"
              name="password"
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
