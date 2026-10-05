import { service } from "../../assets/img_landing";
import { Sobre, Documento_Verificado, Lista, Rayo } from "../../assets/icons/landing/Svg_Icons.jsx";

const universidades = ['UES', 'UCA', 'UTEC', 'UFG', 'ITCA', 'UNIVO', 'USAM', 'UJMD', 'UDB']
const pasos = [
    {paso:'Paso 1', titulo:'Carta de solicitud', texto:'Dirigida formalmente a la institución receptora con tus datos y los del proyecto.', svg:<Sobre />},
    {paso:'Paso 2', titulo:'Perfil del proyecto', texto:'Ficha con objetivo, alcance, tutor institucional y período de ejecución.', svg:<Documento_Verificado />},
    {paso:'Paso 3', titulo:'Plan de trabajo', texto:'Cronograma detallado de actividades con horas estimadas por tarea.', svg:<Lista />}
]

function Service () {
    return (
        <section id="servicio">
            <header>
                <article>SERVICIO SOCIAL</article>
            </header>
            <section className="serv_title">
                <h2>Los documentos del servicio social, generados en segundos.</h2>
                <p>Rellena un solo formulario con tus datos y el sistema genera automáticamente los tres documentos que piden todas las universidades acreditadas de El Salvador.</p>
            </section>
            <section className="serv_izq">
                {pasos.map((paso)=>(
                    <article key={paso.titulo}>
                        {paso.svg}
                        <article>{paso.paso}</article>
                        <h3>{paso.titulo}</h3>
                        <p>{paso.texto}</p>
                    </article>
                ))}
                <article>
                    <Rayo />
                    <p>Genera e imprime los tres documentos en <strong>menos de 5 minutos</strong>. Compatible con todas las universidades acreditadas.</p>
                </article>
            </section>
            <section className="serv_der">
                <img src={service} alt="Una imagen de alguien usando un lapiz y una laptop" width="300px"/>
                <article>
                    <h3>Maria José Guzmán - UES</h3>
                    <p>"Generé los tres documentos en 4 minutos. Antes me tomaba toda una tarde buscando los formatos correctos."</p>
                </article>
            </section>
            <footer>
                <h2>UNIVERSIDADES ACREDITADAS</h2>
                <div>
                    {universidades.map((uni)=> (
                        <article key={uni}>{uni}</article>
                    ))}
                </div>
            </footer>
        </section>
    );
}

export default Service