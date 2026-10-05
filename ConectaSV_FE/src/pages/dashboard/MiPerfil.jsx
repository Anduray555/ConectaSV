import { IconPin } from '../../assets/icons/dashboard/Iconos'

const perfil = {
  siglas: 'AM',
  nombre: 'Andrea Martínez',
  carrera: 'Ing. Sistemas',
  universidad: 'UES',
  ubicacion: 'San Salvador, El Salvador',
  acerca:
    'Estudiante de 8° ciclo de Ingeniería en Sistemas Informáticos en la UES. Apasionada por el desarrollo web full-stack, con experiencia en proyectos universitarios usando React, Node.js y bases de datos relacionales.',
  habilidades: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Figma', 'Git', 'Python', 'REST APIs'],
  estadisticas: [
    { numero: 12, texto: 'Aplicaciones' },
    { numero: 3, texto: 'Entrevistas' },
    { numero: 2, texto: 'Mensajes' },
  ],
}

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
