import { useState } from 'react'
import { IconBuscar, IconEnviar } from '../../assets/icons/dashboard/Iconos'
// TODO API: cargar las conversaciones del usuario autenticado.
import { useOutletContext } from 'react-router-dom'

function Mensajes() {
  const { conversaciones } = useOutletContext()
  const [aviso, setAviso] = useState('')
  const [activaId, setActivaId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [texto, setTexto] = useState('')

  const activa = conversaciones.find((c) => c.id === activaId) ?? conversaciones[0]
  const lista = conversaciones.filter((c) =>
    c.empresa.toLowerCase().includes(busqueda.toLowerCase())
  )

  function enviar(e) {
    e.preventDefault()
    if (!texto.trim()) return

    // TODO API: enviar el mensaje y actualizar el historial con la respuesta del servidor.
    setAviso('El envío de mensajes aún no está conectado.')

  }

  return (
    <section className="mensajes">
      <aside className="conversaciones">
        <h2>Mensajes</h2>

        <label className="buscador">
          <IconBuscar />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
          />
        </label>

        <ul>
          {lista.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={c.id === activa?.id ? 'activo' : ''}
                onClick={() => setActivaId(c.id)}
              >
                <b className="siglas" style={{ background: c.color }}>{c.siglas}</b>
                <strong>{c.empresa}</strong>
                <small className="hora">{c.hora}</small>
                <small className="vacante">{c.vacante}</small>
                <small className="preview">{c.mensajes.at(-1)?.texto}</small>
                {c.sinLeer > 0 && <small className="insignia">{c.sinLeer}</small>}
              </button>
            </li>
          ))}
        </ul>
        {lista.length === 0 && <p className="vacio">Sin conversaciones.</p>}
      </aside>

      {activa ? <section className="chat">
        <header>
          <b className="siglas" style={{ background: activa.color }}>{activa.siglas}</b>
          <h3>{activa.empresa}</h3>
          <p>{activa.vacante}</p>
          {activa.enLinea && <small className="en-linea">En línea</small>}
        </header>

        <ol className="burbujas">
          {activa.mensajes.map((m) => (
            <li key={m.id} className={`burbuja ${m.de}`}>
              {m.de === 'empresa' && (
                <b className="siglas" style={{ background: activa.color }}>{activa.siglas}</b>
              )}
              <p>{m.texto}</p>
              <small>{m.hora}</small>
            </li>
          ))}
        </ol>

        <form onSubmit={enviar}>
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button type="submit" className="btn-enviar" disabled={!texto.trim()}>
            <IconEnviar /> Enviar
          </button>
        </form>
        <p role="status">{aviso}</p>
      </section> : <p className="vacio">Selecciona una conversación.</p>}
    </section>
  )
}

export default Mensajes
