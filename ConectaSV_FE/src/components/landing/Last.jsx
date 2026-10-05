import { useNavigate } from "react-router-dom";

function Last () {
    const navigate = useNavigate()
    return (
        <section className="last">
            <header>
                <article>UNETE HOY - ES GRATIS</article>
            </header>
            <section>
                <h2>Tu próxima oportunidad te está esperando.</h2>
                <p>Más de 2,400 estudiantes ya encontraron su oportunidad laboral o completaron su servicio social a través de ConectaSV.</p>
            </section>
            <footer>
                <button onClick={()=>navigate('/registro')}>Crear cuenta gratis</button>
                {/* <button>Ver plataforma</button> */}
            </footer>
        </section>
    );
}
export default Last