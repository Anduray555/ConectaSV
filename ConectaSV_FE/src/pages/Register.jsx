import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Usuario, Correo, Escuela, Edificio, Check, FlechaIzq  } from "../assets/icons/landing/Svg_Icons.jsx"
import PanelAuth from "../components/login_register/PanelAuth.jsx"
import { Campo, CampoPassword } from "../components/login_register/Campo.jsx"
import PerfilEstudiante from "../components/login_register/PerfilEstudiante"
import PerfilEmpresa from "../components/login_register/PerfilEmpresa"
import "../styles/auth.css"

const tipos = [
  {
    valor: 'estudiante',
    texto: 'Soy estudiante',
    icono: <Escuela />,
    placeholderNombres: 'Andrea Guadalupe',
    placeholderApellidos: 'Martínez López',
    placeholderCorreo: 'andrea@ues.edu.sv',
  },
  {
    valor: 'empresa',
    texto: 'Soy empresa',
    icono: <Edificio />,
    placeholderNombres: 'María Elena',
    placeholderApellidos: 'González Pérez',
    placeholderCorreo: 'rrhh@empresa.com.sv',
  },
]

function Register() {
  const [searchParams] = useSearchParams()
  const tipoInicial = searchParams.get('tipo') === 'empresa' ? 'empresa' : 'estudiante'

  const [paso, setPaso] = useState(1)
  const [tipo, setTipo] = useState(tipoInicial)
  const actual = tipos.find((t) => t.valor === tipo)

  function handleContinuar(e) {
    e.preventDefault()
    setPaso(2)
  }

  function handleCrear(e) {
    e.preventDefault()
    // aquí irá la conexión con el backend
  }

  return (
    <div className="login registro">
      <PanelAuth
        badge="ÚNETE HOY — ES GRATIS"
        titulo="El talento salvadoreño merece las mejores oportunidades."
        texto="Crea tu perfil, aplica a empleos y prácticas, y genera tus documentos de servicio social en minutos."
      />

      <section className="login-der">
        <div className="login-caja">
          <h1>{paso === 1 ? 'Crea tu cuenta' : 'Completa tu perfil'}</h1>
          <p className="subtitulo">
            {paso === 1
              ? 'Únete a más de 2,400 estudiantes salvadoreños.'
              : 'Cuéntanos más sobre ti para personalizar tu experiencia.'}
          </p>

          <div className="pasos">
            <div className={`paso ${paso === 1 ? 'activo' : 'completo'}`}>
              <span>{paso === 1 ? 1 : <Check />}</span> Credenciales
            </div>
            <div className={`pasos-linea ${paso === 2 ? 'completo' : ''}`}></div>
            <div className={`paso ${paso === 2 ? 'activo' : ''}`}>
              <span>2</span> Perfil
            </div>
          </div>

          {/* ---------- PASO 1: credenciales ---------- */}
          <div hidden={paso !== 1}>
            <div className="tipo-cuenta">
              {tipos.map((t) => (
                <button
                  key={t.valor}
                  /* type="button" */
                  className={tipo === t.valor ? 'activo' : ''}
                  onClick={() => setTipo(t.valor)}
                >
                  {t.icono} {t.texto}
                </button>
              ))}
            </div>

            <form onSubmit={handleContinuar}>
              <div className="registro-nombre">
                <div>
              <Campo
                id="registro_nombres"
                label="Nombres"
                icono={<Usuario />}
                placeholder={actual.placeholderNombres}
                autoComplete="given-name"
              />
                </div>
                <div>
              <Campo
                id="registro_apellidos"
                label="Apellidos"
                icono={<Usuario />}
                placeholder={actual.placeholderApellidos}
                autoComplete="family-name"
              />
                </div>
              </div>
              <Campo
                id="registro_correo"
                label="Correo electrónico"
                icono={<Correo />}
                type="email"
                placeholder={actual.placeholderCorreo}
              />
              <CampoPassword
                id="registro_password"
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
              />
              <CampoPassword
                id="registro_confirmar"
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
              />
              <button type="submit" className="btn-principal">Continuar →</button>
            </form>
          </div>

          {/* ---------- PASO 2: perfil (cambia según el tipo) ---------- */}
          <form onSubmit={handleCrear} hidden={paso !== 2}>
            {tipo === 'estudiante' ? <PerfilEstudiante /> : <PerfilEmpresa />}

            <label className="terminos">
              <input type="checkbox" required />
              <span>
                Acepto los <Link to="/terminos">Términos de Uso</Link> y la{' '}
                <Link to="/privacidad">Política de Privacidad</Link> de ConectaSV.
              </span>
            </label>

            <div className="botones-paso">
              <button type="button" className="btn-secundario" onClick={() => setPaso(1)}>
                <FlechaIzq /> Volver
              </button>
              <button type="submit" className="btn-principal">
                Crear cuenta <Check />
              </button>
            </div>
          </form>

          <p className="cambio">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Register