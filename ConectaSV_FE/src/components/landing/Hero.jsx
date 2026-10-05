import {flyingCard} from '../../assets/img_landing'

const estadísticas = [
    {numero: '2400+', texto: 'Estudiantes registrados'},
    {numero: '120+', texto: 'Empresas activas'},
    {numero: '347', texto: 'Ofertas publicadas'},
    {numero: '18', texto: 'Universidades acreditadas'},
    {numero: '850+', texto: 'Contrataciones exitosas'},
]

function Hero() {
  return (
    <section id="caracteristicas">
        <header>
            <article>PLATAFORMA ESTUDIANTIL SALVADOREÑA</article>
        </header>
        <section className="carac_izq">
            <h1>Tu carrera profesional empieza aquí.</h1>
            <p>Conectamos a estudiantes salvadoreños con empleos, prácticas y oportunidades de servicio social. Todo en un solo lugar, con herramientas que facilitan cada paso del proceso.</p>
            {/* <button>Explorar oportunidades</button>
            <button>Soy una empresa</button> */}
        </section>
        <section className="carac_der">
            <img src={flyingCard} alt="Una imagen de personas felices porque encontraron trabajo" width="300px"/>
        </section>
        <footer>
            <section className="carac_arti_footer">
                {estadísticas.map((est) =>(
                    <article key={est.numero}>
                        <h2>{est.numero}</h2>
                        <p>{est.texto}</p>
                    </article>
                ))}
            </section>
        </footer>
    </section>
  )
}

export default Hero