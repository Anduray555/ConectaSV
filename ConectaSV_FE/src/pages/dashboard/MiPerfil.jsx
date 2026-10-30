import { IconPin } from '../../assets/icons/dashboard/Iconos'

// TODO API: cargar el perfil del estudiante autenticado.
import { useOutletContext } from 'react-router-dom'

function MiPerfil() {
  const { perfil } = useOutletContext()
  return (
    <section className="perfil">
      <article className="tarjeta perfil-principal">
        <header>
          <b className="avatar-grande">{perfil.siglas}</b>
          <h2>{perfil.nombre || 'Perfil sin cargar'}</h2>
          <p>{[perfil.carrera, perfil.universidad].filter(Boolean).join(' · ') || 'Sin información académica'}</p>
          <p className="ubicacion">
            <IconPin /> {perfil.ubicacion}
          </p>
          <button type="button" className="btn-contorno" disabled>Editar perfil</button>
        </header>

        <ul className="estadisticas">
          {perfil.estadisticas.map((e) => (
            <li key={e.texto}>
              <strong>{e.numero ?? '—'}</strong>
              {e.texto}
            </li>
          ))}
        </ul>
      </article>

      <section className="tarjeta">
        <h3>Sobre mí</h3>
        <p>{perfil.acerca || 'Sin descripción.'}</p>
      </section>

      <section className="tarjeta">
        <h3>Habilidades</h3>
        {perfil.habilidades.length === 0 && <p>Sin habilidades registradas.</p>}
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
