import { Link } from "react-router-dom"
import { Logo } from "../Logo"
import { Lupa, Mensaje, Documento } from "../../assets/icons/landing/Svg_Icons"
import { Recuadro, Estadistica } from "./Login_Register.jsx"

const recuadros = [
  { svg: <Lupa />, texto: '347 ofertas activas este mes' },
  { svg: <Mensaje />, texto: 'Mensajería directa con empresas' },
  { svg: <Documento />, texto: 'Generador de documentos SS' },
]

const estadisticas = [
  { numero: '2,400+', texto: 'Estudiantes' },
  { numero: '120+', texto: 'Empresas' },
  { numero: '850+', texto: 'Contrataciones' },
]

function PanelAuth({ badge, titulo, texto }) {
  return (
    <section className="login-izq">
      <Link to="/" className="volver">← Volver al inicio</Link>
      <Logo />

      <div className="login-hero">
        <span className="badge">{badge}</span>
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>

      <div className="recuadros">
        {recuadros.map((re) => (
          <Recuadro key={re.texto} icono={re.svg} texto={re.texto} />
        ))}
      </div>

      <footer className="footer-lr">
        {estadisticas.map((dato) => (
          <Estadistica key={dato.texto} numero={dato.numero} texto={dato.texto} />
        ))}
      </footer>
    </section>
  )
}

export default PanelAuth