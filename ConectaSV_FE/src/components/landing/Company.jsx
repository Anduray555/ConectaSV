import {company} from '../../assets/img_landing'
import {Megafono, Diana, Grafico, Verificado} from '../../assets/icons/landing/Svg_Icons';
import { useNavigate } from 'react-router-dom';

const empresa = [
    {titulo:'Publicar ofertas', texto:'Crea y gestiona tus ofertas de empleo, práctica o servicio social en minutos. Controla el estado de cada publicación.', svg:<Megafono />},
    {titulo:'Candidatos con Match', texto:'El sistema calcula la compatibilidad de cada aplicante con tu oferta y la ordena para que veas los mejores primero.', svg:<Diana />},
    {titulo:'Dashboard del proceso', texto:'Visualiza en tiempo real cuántos aplicantes tiene cada oferta y en qué etapa del proceso se encuentran.', svg:<Grafico />},
    {titulo:'Verificación oficial', texto:'Empresas verificadas generan más confianza entre los candidatos. El proceso es rápido y completamente digital.', svg:<Verificado />},
]

function Company () {
    const navigate = useNavigate()

    return (
        <section id="empresas">
            <header>
                <article>PARA EMPRESAS</article>
            </header>
            <section className="emp_izq">
                <img src={company} alt="Una imagen de unos compañeros de trabajo dando los cinco" width="300px"/>
            </section>
            <section className="emp_der">
                <h2>Encuentra el talento universitario que tu empresa necesita</h2>
                <p>Accede a miles de estudiantes de las principales universidades de El Salvador. Filtra, evalúa y contrata de forma eficiente desde un solo panel.</p>
                {empresa.map((emp)=> (
                    <article key={emp.titulo}>
                        {emp.svg}
                        <h3>{emp.titulo}</h3>
                        <p>{emp.texto}</p>
                    </article>
                ))}
            </section>
            <footer>
                <button onClick={()=> navigate('/registro?tipo=empresa')}>Registrar mi empresa →</button>
            </footer>
        </section>
    );
}

export default Company