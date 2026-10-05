import {t1, t2, t3} from '../../assets/img_landing'

const testimonio = [
    {opinion:'ConectaSV me conectó con Banco Agrícola cuando apenas terminaba mi 8° ciclo. La mensajería directa con RRHH fue clave para que pudiera demostrar mis habilidades antes de la entrevista.', img:t1, nombre:'Andrea Martinez', carrera:'Ing. Sistemas - UES', profesion:'Desarrollador FrontEnd - Banco Agricola'},
    {opinion:'En menos de dos semanas de registrarme ya tenía tres entrevistas agendadas. La búsqueda filtrada por tipo de oportunidad me ayudó a encontrar exactamente lo que buscaba para mis horas práctica.', img:t2, nombre:'Carlos Hernandez', carrera:'Ing. Sistemas - UCA', profesion:'Practicante de Marketing — Grupo Roble'},
    {opinion:'El generador de documentos para servicio social fue increíble. Mi coordinadora no podía creer que tenía todo listo en un día. Antes ese proceso tomaba semanas de ir y venir con papeles.', img:t3, nombre:'Sofia Portillo', carrera:'Lic. Enfermería - UTEC', profesion:'Servicio Social — Cruz Roja Salvadoreña'}
]

function Testimony() {
    return (
        <section className="testimonio">
            <header>
                <article>TESTIMONIOS</article>
            </header>
            <h2>Historias reales de estudiantes salvadoreños</h2>
            {testimonio.map((test)=>(
                <article key={test.nombre}>
                <p>{test.opinion}</p>
                <img src={test.img} alt=""/>
                <article>
                    <h3>{test.nombre}</h3>
                    <h4>{test.carrera}</h4>
                    <h5>{test.profesion}</h5>
                </article>
            </article>
            ))}
        </section>
    );
}
export default Testimony