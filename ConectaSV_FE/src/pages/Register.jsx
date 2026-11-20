import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Usuario, Correo, Escuela, Edificio, Check, FlechaIzq } from '../assets/icons/landing/Svg_Icons.jsx'
import PanelAuth from '../components/login_register/PanelAuth.jsx'
import { Campo, CampoPassword } from '../components/login_register/Campo.jsx'
import PerfilEstudiante from '../components/login_register/PerfilEstudiante'
import PerfilEmpresa from '../components/login_register/PerfilEmpresa'
import useAuth from '../hooks/useAuth.js'
import { catalogApi } from '../api/catalogs'
import { parseApiError } from '../api/errors'
import { homeFor } from '../utils/roleRoutes.js'
import '../styles/auth.css'

const TIPOS = [
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

// Campos del paso 1. Si el backend marca alguno, regresamos a ese paso.
const CAMPOS_PASO_1 = ['nombres', 'apellidos', 'email', 'password', 'password_confirmation']

// "Andrea Guadalupe" → ["Andrea", "Guadalupe"]; "María de los Ángeles" → ["María", "de los Ángeles"]
function separar(texto) {
  const [primero, ...resto] = texto.trim().split(/\s+/)
  return [primero ?? '', resto.join(' ') || null]
}

// El backend separa nombres y apellidos; en el formulario son un solo campo cada uno.
function erroresDelFormulario(fieldErrors) {
  const { first_name, second_name, first_surname, second_surname, ...resto } = fieldErrors
  return {
    ...resto,
    nombres: first_name ?? second_name,
    apellidos: first_surname ?? second_surname,
  }
}

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipoInicial = searchParams.get('tipo') === 'empresa' ? 'empresa' : 'estudiante'

  const [paso, setPaso] = useState(1)
  const [tipo, setTipo] = useState(tipoInicial)
  const [credenciales, setCredenciales] = useState(null)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [catalogos, setCatalogos] = useState({ universidades: [], sectores: [], tiposOferta: [] })
  const [errorCatalogos, setErrorCatalogos] = useState(null)
  const actual = TIPOS.find((t) => t.valor === tipo)

  useEffect(() => {
    Promise.all([catalogApi.universities(), catalogApi.sectors(), catalogApi.offerTypes()])
      .then(([universidades, sectores, tiposOferta]) => setCatalogos({ universidades, sectores, tiposOferta }))
      .catch(() => setErrorCatalogos('No se pudieron cargar las opciones del formulario. Recarga la página.'))
  }, [])

  function cambiarTipo(valor) {
    setTipo(valor)
    setErrores({})
    setMensaje(null)
  }

  function handleContinuar(e) {
    e.preventDefault()
    const datos = Object.fromEntries(new FormData(e.currentTarget))

    if (datos.password !== datos.password_confirmation) {
      setErrores({ password_confirmation: 'Las contraseñas no coinciden.' })
      return
    }

    setErrores({})
    setMensaje(null)
    setCredenciales(datos)
    setPaso(2)
  }

  async function handleCrear(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const perfil = Object.fromEntries(formData)
    delete perfil.interests

    const [first_name, second_name] = separar(credenciales.nombres)
    const [first_surname, second_surname] = separar(credenciales.apellidos)

    const datos = {
      first_name,
      second_name,
      first_surname,
      second_surname,
      email: credenciales.email,
      password: credenciales.password,
      password_confirmation: credenciales.password_confirmation,
      ...perfil,
    }
    if (tipo === 'estudiante') {
      datos.interests = formData.getAll('interests').map(Number)
      if (datos.interests.length === 0) {
        setErrores({ interests: 'Selecciona al menos un tipo de oportunidad.' })
        return
      }
    }

    setErrores({})
    setMensaje(null)
    setEnviando(true)

    try {
      const user = await register(tipo, datos)
      navigate(homeFor(user.role), { replace: true })
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err)
      const nuevos = erroresDelFormulario(fieldErrors)
      setErrores(nuevos)
      setMensaje(Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : message)
      if (CAMPOS_PASO_1.some((campo) => nuevos[campo])) setPaso(1)
    } finally {
      setEnviando(false)
    }
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

          {(mensaje || errorCatalogos) && (
            <p className="alerta-error" role="alert">{mensaje ?? errorCatalogos}</p>
          )}

          {/* ---------- PASO 1: credenciales ---------- */}
          <div hidden={paso !== 1}>
            <div className="tipo-cuenta">
              {TIPOS.map((t) => (
                <button
                  key={t.valor}
                  type="button"
                  className={tipo === t.valor ? 'activo' : ''}
                  aria-pressed={tipo === t.valor}
                  onClick={() => cambiarTipo(t.valor)}
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
                    name="nombres"
                    label="Nombres"
                    icono={<Usuario />}
                    placeholder={actual.placeholderNombres}
                    autoComplete="given-name"
                    error={errores.nombres}
                  />
                </div>
                <div>
                  <Campo
                    id="registro_apellidos"
                    name="apellidos"
                    label="Apellidos"
                    icono={<Usuario />}
                    placeholder={actual.placeholderApellidos}
                    autoComplete="family-name"
                    error={errores.apellidos}
                  />
                </div>
              </div>
              <Campo
                id="registro_correo"
                name="email"
                label="Correo electrónico"
                icono={<Correo />}
                type="email"
                placeholder={actual.placeholderCorreo}
                autoComplete="email"
                error={errores.email}
              />
              <CampoPassword
                id="registro_password"
                name="password"
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                error={errores.password}
              />
              <CampoPassword
                id="registro_confirmar"
                name="password_confirmation"
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                error={errores.password_confirmation}
              />
              <button type="submit" className="btn-principal">Continuar →</button>
            </form>
          </div>

          {/* ---------- PASO 2: perfil (cambia según el tipo) ---------- */}
          <form onSubmit={handleCrear} hidden={paso !== 2}>
            {tipo === 'estudiante' ? (
              <PerfilEstudiante
                universidades={catalogos.universidades}
                tiposOferta={catalogos.tiposOferta}
                errores={errores}
              />
            ) : (
              <PerfilEmpresa sectores={catalogos.sectores} errores={errores} />
            )}

            <label className="terminos">
              <input type="checkbox" required />
              <span>
                Acepto los <Link to="/terminos">Términos de Uso</Link> y la{' '}
                <Link to="/privacidad">Política de Privacidad</Link> de ConectaSV.
              </span>
            </label>

            <div className="botones-paso">
              <button type="button" className="btn-secundario" onClick={() => setPaso(1)} disabled={enviando}>
                <FlechaIzq /> Volver
              </button>
              <button type="submit" className="btn-principal" disabled={enviando}>
                {enviando ? 'Creando cuenta…' : <>Crear cuenta <Check /></>}
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
