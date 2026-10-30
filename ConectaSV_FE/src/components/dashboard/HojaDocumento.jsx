function formatear(fecha) {
  if (!fecha) return '—'
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-SV')
}

function HojaDocumento({ doc, datos }) {
  const hoy = new Date().toLocaleDateString('es-SV', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="hoja">
      {doc === 'carta' && (
        <>
          <p className="derecha">{datos.ciudad ? `${datos.ciudad}, ` : ''}{hoy}</p>
          <address>
            Señores<br />
            <strong>{datos.institucion}</strong><br />
            {datos.direccion}
          </address>
          <p>Estimados señores:</p>
          <p>
            Por medio de la presente, yo, <strong>{datos.nombre}</strong>, estudiante de{' '}
            <strong>{datos.carrera}</strong> de la <strong>{datos.universidad}</strong>, con
            número de carné <strong>{datos.carne}</strong>, solicito se me permita realizar mi{' '}
            <strong>Servicio Social</strong> en su institución.
          </p>
          <p>
            El proyecto propuesto se denomina <strong>"{datos.proyecto}"</strong>, a ejecutar en{' '}
            <strong>{datos.horas} horas</strong> entre el <strong>{formatear(datos.inicio)}</strong>{' '}
            y el <strong>{formatear(datos.fin)}</strong>.
          </p>
          <p>En espera de una respuesta favorable,</p>
          <footer>
            <strong>{datos.nombre}</strong>
            <small>Carné: {datos.carne}</small>
            <small>{datos.carrera}</small>
            <small>{datos.universidad}</small>
          </footer>
        </>
      )}

      {doc === 'proyecto' && (
        <>
          <h4>Perfil del proyecto</h4>
          <dl>
            <dt>Proyecto</dt>
            <dd>{datos.proyecto}</dd>
            <dt>Institución receptora</dt>
            <dd>{datos.institucion}</dd>
            <dt>Tutor institucional</dt>
            <dd>{datos.tutor} · {datos.telTutor}</dd>
            <dt>Estudiante</dt>
            <dd>{datos.nombre} ({datos.carne})</dd>
            <dt>Período de ejecución</dt>
            <dd>{formatear(datos.inicio)} al {formatear(datos.fin)} · {datos.horas} horas</dd>
          </dl>
        </>
      )}

      {doc === 'plan' && (
        <>
          <h4>Plan de trabajo</h4>
          <p>{datos.proyecto}</p>
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Horas</th>
              </tr>
            </thead>
            <tbody>
              {(datos.actividades ?? []).map(({ nombre, horas }, indice) => (
                <tr key={indice}>
                  <td>{nombre}</td>
                  <td>{horas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </article>
  )
}

export default HojaDocumento
