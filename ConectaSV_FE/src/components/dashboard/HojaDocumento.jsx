function formatear(fecha) {
  if (!fecha) return '—'
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-SV')
}

// Reparto de horas del plan de trabajo (porcentaje de cada fase)
const fases = [
  ['Inducción y diagnóstico', 0.1],
  ['Desarrollo del proyecto', 0.6],
  ['Pruebas y ajustes', 0.2],
  ['Documentación y cierre', 0.1],
]

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
          <p className="derecha">San Salvador, {hoy}</p>
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
              {fases.map(([nombre, porcentaje]) => (
                <tr key={nombre}>
                  <td>{nombre}</td>
                  <td>{Math.round(datos.horas * porcentaje)}</td>
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
