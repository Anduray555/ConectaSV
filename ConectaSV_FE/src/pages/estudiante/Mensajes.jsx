import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconBuscar, IconEnviar } from '../../assets/icons/dashboard/Iconos'

// Bandeja de mensajes compartida por estudiante y empresa.
// `className` permite añadir estilos propios de un rol (p. ej. "empresa-mensajes").

// TODO BACKEND: cargar conversaciones e historial paginados del usuario autenticado; seleccionar
// una conversación al terminar la carga y manejar conversación eliminada, historial vacío y fallos.
// «empresa» es el nombre del interlocutor y la clase visual del mensaje recibido; derivar «yo»
// del remitente autenticado. Sincronizar presencia, último mensaje y fechas reales.

function ItemConversacion({ conversacion: c, activa, onSeleccionar }) {
  return (
    <li>
      <button type="button" className={activa ? 'activo' : ''} onClick={() => onSeleccionar(c.id)}>
        <b className="siglas" style={{ background: c.color }}>{c.siglas}</b>
        <strong>{c.empresa}</strong>
        <small className="hora">{c.hora}</small>
        <small className="vacante">{c.vacante}</small>
        <small className="preview">{c.mensajes.at(-1)?.texto}</small>
        {c.sinLeer > 0 && <small className="insignia">{c.sinLeer}</small>}
      </button>
    </li>
  )
}

function Mensajes({ className = '' }) {
  const { conversaciones } = useOutletContext()
  const [activaId, setActivaId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')
  const historial = useRef(null)

  const activa = conversaciones.find((c) => c.id === activaId) ?? conversaciones[0]
  // Si la lista está paginada, buscar en el servidor para incluir conversaciones no cargadas.
  const lista = conversaciones.filter((c) => c.empresa.toLowerCase().includes(busqueda.toLowerCase()))

  // Mantiene el historial desplazado hasta el último mensaje.
  useEffect(() => {
    if (historial.current) historial.current.scrollTop = historial.current.scrollHeight
  }, [activaId, activa?.mensajes.length])

  function seleccionar(id) {
    setActivaId(id)
    setTexto('')
    // TODO BACKEND: marcar la conversación como leída y sincronizar el contador.
  }

  function enviar(e) {
    e.preventDefault()
    if (!texto.trim() || !activa) return

    // TODO BACKEND: enviar el mensaje y actualizar el historial con la respuesta del servidor
    // (id y fecha reales, envío pendiente/error/reintento, sin duplicados).
    setAviso('El envío de mensajes aún no está conectado.')
  }

  return (
    <section className={`mensajes ${className}`.trim()}>
      <aside className="conversaciones">
        <h2>Mensajes</h2>

        <label className="buscador">
          <IconBuscar />
          <input
            type="search"
            aria-label="Buscar conversación"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>

        <ul>
          {lista.map((c) => (
            <ItemConversacion key={c.id} conversacion={c} activa={c.id === activa?.id} onSeleccionar={seleccionar} />
          ))}
        </ul>
        {lista.length === 0 && <p className="vacio">Sin conversaciones.</p>}
      </aside>

      {activa ? (
        <section className="chat">
          <header>
            <b className="siglas" style={{ background: activa.color }}>{activa.siglas}</b>
            <h3>{activa.empresa}</h3>
            <p>{activa.vacante}</p>
            {activa.enLinea && <small className="en-linea">En línea</small>}
          </header>

          <ol ref={historial} className="burbujas" aria-label="Historial de mensajes" aria-live="polite">
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
              aria-label="Escribe un mensaje"
              placeholder="Escribe un mensaje..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit" className="btn-enviar" disabled={!texto.trim()}>
              <IconEnviar /> Enviar
            </button>
          </form>
          <p role="status">{aviso}</p>
        </section>
      ) : (
        <p className="vacio">Selecciona una conversación.</p>
      )}
    </section>
  )
}

export default Mensajes
