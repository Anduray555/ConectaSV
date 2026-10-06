import { IconPin } from '../../assets/icons/dashboard/Iconos'

// TODO API: cargar el perfil del estudiante autenticado.
import { perfilMock as perfil } from '../../data/dashboard.mock'

function MiPerfil() {
  return (
    <section className="perfil">
      <article className="tarjeta perfil-principal">
        <header>
          <b className="avatar-grande">{perfil.siglas}</b>
          <h2>{perfil.nombre}</h2>
          <p>Estudiante de {perfil.carrera} · {perfil.universidad}</p>
          <p className="ubicacion">
            <IconPin /> {perfil.ubicacion}
          </p>
          <button type="button" className="btn-contorno">Editar perfil</button>
        </header>

        <ul className="estadisticas">
          {perfil.estadisticas.map((e) => (
            <li key={e.texto}>
              <strong>{e.numero}</strong>
              {e.texto}
            </li>
          ))}
        </ul>
      </article>

      <section className="tarjeta">
        <h3>Sobre mí</h3>
        <p>{perfil.acerca}</p>
      </section>

      <section className="tarjeta">
        <h3>Habilidades</h3>
        <ul className="etiquetas">
          {perfil.habilidades.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default MiPerfil
