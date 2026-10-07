import { Link } from 'react-router-dom'
import { ofertasMock } from '../../data/dashboard.mock'

const estadísticas = [
  { numero: '2400+', texto: 'Estudiantes registrados' },
  { numero: '120+', texto: 'Empresas activas' },
  { numero: '347', texto: 'Ofertas publicadas' },
  { numero: '18', texto: 'Universidades acreditadas' },
  { numero: '850+', texto: 'Contrataciones exitosas' },
]

function Hero() {
  return (
    <section id="caracteristicas">
      <header><article><span className="status-dot" /> TU PRÓXIMO PASO EMPIEZA AQUÍ</article></header>
      <section className="carac_izq">
        <h1>Conecta tu talento.<br /><span>Construye tu futuro.</span></h1>
        <p>Empleos, prácticas y servicio social para estudiantes salvadoreños. Un espacio para descubrir oportunidades y dar el siguiente paso en tu carrera.</p>
        <div className="hero-actions">
          <Link className="hero-primary" to="/registro">Comenzar ahora <span aria-hidden="true">↗</span></Link>
          <Link className="hero-secondary" to="/registro?tipo=empresa">Soy una empresa <span aria-hidden="true">→</span></Link>
        </div>
        <p className="hero-note">01 / TALENTO LOCAL. POSIBILIDADES REALES.</p>
      </section>
      <section className="carac_der product-preview" aria-label="Vista previa de oportunidades con datos de ejemplo">
        <div className="preview-toolbar"><span className="preview-brand">C / ConectaSV</span><span className="preview-live"><span className="status-dot" /> Vista de ejemplo</span></div>
        <div className="preview-workspace">
          <aside className="preview-sidebar" aria-hidden="true"><span className="preview-nav-active">↗</span><span>▦</span><span>✉</span><span>◎</span></aside>
          <div className="preview-content">
            <div className="preview-heading"><div><span className="preview-eyebrow">TU ESPACIO DE OPORTUNIDADES</span><h2>Tu siguiente capítulo.</h2></div><span className="preview-avatar">SV</span></div>
            <div className="preview-metrics"><article><span>OPORTUNIDADES</span><strong>347 <small>↗</small></strong></article><article><span>EMPRESAS</span><strong>120<span className="metric-plus">+</span></strong></article></div>
            <div className="preview-list-label"><span>Explora posibilidades</span><span>↗</span></div>
            {ofertasMock.slice(0, 3).map((oferta) => <article className="preview-job" key={oferta.id}><span className="preview-job-icon">{oferta.empresa.slice(0, 2).toUpperCase()}</span><div><h3>{oferta.titulo}</h3><p>{oferta.empresa}</p></div><span className="preview-job-arrow" aria-hidden="true">↗</span></article>)}
            <Link className="preview-link" to="/registro">Encuentra tu oportunidad <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <footer><section className="carac_arti_footer">{estadísticas.map((est) => <article key={est.numero}><h2>{est.numero}</h2><p>{est.texto}</p></article>)}</section></footer>
    </section>
  )
}
export default Hero

