import { useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { IconEnviar, IconMensajes } from '../../assets/icons/dashboard/Iconos'

const estados = { abierto: 'Abierto', proceso: 'En proceso', resuelto: 'Resuelto' }
export default function SoporteAdmin() {
  const { datos, accion, ocupado } = useOutletContext()
  const [params] = useSearchParams()
  const [seleccionado, setSeleccionado] = useState(params.get('ticket'))
  const [estado, setEstado] = useState('todos')
  const [tipo, setTipo] = useState('todos')
  const [borradores, setBorradores] = useState({})
  // TODO BACKEND: consultar tickets filtrados y paginados; cargar mensajes del ticket
  // seleccionado, marcarlo como leído y actualizar por polling/WebSocket autorizado.
  const visibles = datos.tickets.filter((t) => (estado === 'todos' || t.estado === estado) && (tipo === 'todos' || t.tipo === tipo))
  const ticket = visibles.find((t) => String(t.id) === String(seleccionado))
  const ticketId = ticket?.id
  const borrador = ticketId == null ? '' : borradores[ticketId] || ''

  function cambiarBorrador(event) {
    if (ticketId == null) return
    const texto = event.target.value
    setBorradores((anteriores) => ({ ...anteriores, [ticketId]: texto }))
  }
  async function responder(e) {
    e.preventDefault()
    const texto = (borradores[ticket?.id] || '').trim()
    if (!ticket || !texto || ocupado) return
    // TODO BACKEND: enviar texto e id al servidor; usar autor/fecha/id de su respuesta.
    // Conservar el borrador ante un error y evitar duplicados con idempotencia.
    const enviado = await accion('responderTicket', ticket.id, { texto })
    if (enviado) setBorradores((anteriores) => ({ ...anteriores, [ticket.id]: '' }))
  }
  return (
    <section className="admin-soporte" aria-label="Soporte">
      <aside className="admin-tickets">
        <menu className="filtros">{[['todos', 'Todos'], ...Object.entries(estados)].map(([valor, texto]) => <li key={valor}><button type="button" aria-pressed={estado === valor} className={estado === valor ? 'activo' : ''} onClick={() => setEstado(valor)}>{texto}</button></li>)}</menu>
        <menu className="filtros">{[['todos', 'Todos los usuarios'], ['estudiante', 'Estudiantes'], ['empresa', 'Empresas']].map(([valor, texto]) => <li key={valor}><button type="button" aria-pressed={tipo === valor} className={tipo === valor ? 'activo' : ''} onClick={() => setTipo(valor)}>{texto}</button></li>)}</menu>
        <div className="admin-ticket-lista">{visibles.map((t) => <button type="button" key={t.id} className={`admin-ticket ${ticket?.id === t.id ? 'seleccionado' : ''}`} onClick={() => setSeleccionado(t.id)}><strong>{t.nombre}</strong><span>{t.asunto}</span><small>{t.tipo}</small><div><span className="admin-insignia">{t.prioridad}</span><span className="admin-insignia">{estados[t.estado]}</span></div></button>)}</div>
        {!visibles.length && <p className="admin-vacio">{datos.cargado ? 'No hay tickets con estos filtros.' : 'Los tickets se mostrarán cuando se conecte el servicio.'}</p>}
      </aside>
      <section className="admin-conversacion">
        {ticket ? <>
          <header><div><h2>{ticket.nombre}</h2><p>{ticket.asunto}</p></div><label>Estado<select disabled={ocupado} value={ticket.estado} onChange={(e) => accion('cambiarEstadoTicket', ticket.id, { estado: e.target.value })}>{Object.entries(estados).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}</select></label></header>
          <div className="admin-mensajes">{(ticket.mensajes ?? []).map((m) => <article key={m.id} className={m.deAdmin ? 'de-admin' : ''}><small>{m.autor}</small><p>{m.texto}</p><time dateTime={m.fecha}>{new Date(m.fecha).toLocaleString('es-SV')}</time></article>)}{!ticket.mensajes?.length && <p className="admin-vacio">No hay mensajes cargados.</p>}</div>
        </> : <div className="admin-chat-vacio"><IconMensajes /><h2>Mensajes de soporte</h2><p>Selecciona un ticket para ver la conversación.</p></div>}
        <form onSubmit={responder}><input aria-label="Respuesta al usuario" placeholder="Escribir respuesta al usuario..." disabled={!ticket || ocupado} value={borrador} onChange={cambiarBorrador} /><button type="submit" disabled={!ticket || ocupado || !borrador.trim()}><IconEnviar />Responder</button></form>
      </section>
    </section>
  )
}
