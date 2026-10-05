import { IconPin } from '../../assets/icons/dashboard/Iconos'
import { tiposOferta } from '../../data/dashboard'

function TarjetaOferta({ titulo, empresa, siglas, color, ubicacion, salario, tipo, etiquetas, publicado, aplicantes }) {
  return (
    <article className="tarjeta oferta">
      <b className="siglas" style={{ background: color }}>{siglas}</b>
      <h3>{titulo}</h3>
      <strong className={`tipo ${tipo}`}>{tiposOferta[tipo]}</strong>
      <p className="compania">{empresa}</p>
      <p className="info">
        <IconPin /> {ubicacion}
        {salario && <> · <b>{salario}</b></>}
      </p>
      <ul className="etiquetas">
        {etiquetas.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <small>{publicado} · {aplicantes} aplicantes</small>
    </article>
  )
}

export default TarjetaOferta
