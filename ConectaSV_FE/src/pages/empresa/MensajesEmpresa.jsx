import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconBuscar, IconEnviar } from '../../assets/icons/dashboard/Iconos'

export default function MensajesEmpresa() {
  const { conversaciones, setConversaciones } = useOutletContext()
  // TODO BACKEND: cargar conversaciones e historial paginados; seleccionar una conversación
  // al terminar la carga y manejar conversación eliminada, historial vacío y fallos de consulta.
  const [activaId, setActivaId] = useState(conversaciones[0]?.id)
  const [busqueda, setBusqueda] = useState('')
  const [texto, setTexto] = useState('')
  const activa = conversaciones.find((c) => c.id === activaId)
  const historial = useRef(null)
  useEffect(() => { if (historial.current) historial.current.scrollTop = historial.current.scrollHeight }, [activaId, activa?.mensajes.length])
  // TODO BACKEND: adaptar «empresa» al nombre del candidato/interlocutor en el contrato real.
  // Si la lista está paginada, buscar en el servidor para incluir conversaciones no cargadas.
  // Derivar «yo» del remitente autenticado; «empresa» es aquí la clase visual del mensaje recibido.
  // Sincronizar presencia/enLinea, último mensaje y fechas reales mediante el canal acordado.
  const lista = conversaciones.filter((c) => c.empresa.toLowerCase().includes(busqueda.toLowerCase()))
  function seleccionar(id) {
    setActivaId(id); setTexto('')
    // TODO BACKEND: marcar la conversación como leída y sincronizar el contador.
    // Aplicar también al abrir la conversación inicial y al recibir mensajes mientras está visible.
    setConversaciones((actuales) => actuales.map((c) => c.id === id ? { ...c, sinLeer: 0 } : c))
  }
  function enviar(e) {
    e.preventDefault()
    if (!texto.trim() || !activa) return
    // TODO BACKEND: enviar como empresa autenticada y sincronizar mensajes/lecturas en tiempo real.
    // Usar id y fecha del servidor, gestionar envío pendiente/error/reintento y evitar duplicados.
    // No vaciar el borrador ni confirmar el envío hasta recibir éxito, salvo flujo optimista con reversión.
    const mensaje = { id: crypto.randomUUID(), de: 'yo', texto: texto.trim(), hora: 'Ahora' }
    setConversaciones((actuales) => actuales.map((c) => c.id === activaId ? { ...c, sinLeer: 0, hora: 'Ahora', mensajes: [...c.mensajes, mensaje] } : c))
    setTexto('')
  }
  return <section className="mensajes empresa-mensajes">
    <aside className="conversaciones"><h2>Mensajes</h2><label className="buscador"><IconBuscar /><input type="search" aria-label="Buscar candidato" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label><ul>{lista.map((c) => <li key={c.id}><button className={c.id === activaId ? 'activo' : ''} onClick={() => seleccionar(c.id)}><b className="siglas" style={{ background: c.color }}>{c.siglas}</b><strong>{c.empresa}</strong><small>{c.hora}</small><small className="vacante">{c.vacante}</small><small className="preview">{c.mensajes.at(-1)?.texto}</small>{c.sinLeer > 0 && <small className="insignia">{c.sinLeer}</small>}</button></li>)}</ul>{lista.length === 0 && <p className="vacio">Sin conversaciones.</p>}</aside>
    {activa ? <section className="chat"><header><b className="siglas" style={{ background: activa.color }}>{activa.siglas}</b><h3>{activa.empresa}</h3><p>{activa.vacante}</p>{activa.enLinea && <small className="en-linea">En línea</small>}</header><ol ref={historial} className="burbujas" aria-label="Historial de mensajes" aria-live="polite">{activa.mensajes.map((m) => <li key={m.id} className={`burbuja ${m.de}`}>{m.de === 'empresa' && <b className="siglas" style={{ background: activa.color }}>{activa.siglas}</b>}<p>{m.texto}</p><small>{m.hora}</small></li>)}</ol><form onSubmit={enviar}><input aria-label="Mensaje para el candidato" placeholder="Escribe un mensaje..." value={texto} onChange={(e) => setTexto(e.target.value)} /><button className="btn-enviar" type="submit" disabled={!texto.trim()}><IconEnviar />Enviar</button></form></section> : <p className="vacio">Selecciona una conversación.</p>}
  </section>
}

