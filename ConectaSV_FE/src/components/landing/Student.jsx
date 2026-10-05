import {students} from '../../assets/img_landing'
import { Lupa, Mensaje, Documento, Usuario } from '../../assets/icons/landing/Svg_Icons'
import { useNavigate } from 'react-router-dom'

const estudiante = [
    {titulo:'Explorar oportunidades', texto:'Filtra por tipo de oportunidad: empleo, práctica profesional o servicio social. Busca por habilidades, empresa o ubicación.', svg:<Lupa />},
    {titulo:'Mensajería directa', texto:'Cuando una empresa te selecciona, puedes conversar directamente desde la plataforma sin salir de tu perfil.', svg:<Mensaje />},
    {titulo:'Documentos SS automáticos', texto:'Genera en segundos la carta de solicitud, perfil del proyecto y plan de trabajo para tu servicio social universitario.', svg:<Documento />},
    {titulo:'Perfil profesional', texto:'Construye tu perfil con carrera, universidad, habilidades y experiencia. Destácate ante las empresas que más te interesan.', svg:<Usuario />}
]

function Student() {
    const navigate = useNavigate()
    return (
        <section id="estudiantes">
            <header>
                <article>PARA ESTUDIANTES</article>
            </header>
            <section className="estu_izq">
                <h2>Todo lo que necesitas para lanzar tu carrera</h2>
                <p>Desde tu primera práctica hasta tu servicio social o primer empleo formal — ConectaSV te acompaña en cada etapa.</p>
                {estudiante.map((estu)=>(
                    <article key={estu.titulo}>
                        {estu.svg}
                        <h3>{estu.titulo}</h3>
                        <p>{estu.texto}</p>
                    </article>
                ))}
            </section>
            <section className="estu_der">
                <img src={students} alt="Una imagen de unos estudiantes recién graduados" width="300px"/>
            </section>
            <footer>
                <button onClick={()=> navigate('/registro?tipo=estudiante')}>Crear perfil de estudiante →</button>
            </footer>
        </section>       
    )
}
export default Student