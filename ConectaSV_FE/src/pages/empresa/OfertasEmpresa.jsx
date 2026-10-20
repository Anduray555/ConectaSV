import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

// TODO BACKEND: adaptar el formulario al contrato real (tipo, modalidad, salario/moneda,
// etiquetas y campos obligatorios). Las etiquetas de UI no son códigos definitivos de la API.
const vacia = { titulo: '', ubicacion: '', salario: '', tipo: 'Empleo', etiquetas: [], descripcion: '', activa: true }

export default function OfertasEmpresa() {
  const { empresa, ofertas, setOfertas, candidatos } = useOutletContext()
  const [edicion, setEdicion] = useState(null)
  const [eliminarId, setEliminarId] = useState(null)
  const [aviso, setAviso] = useState('')
  function guardar(e) {
    e.preventDefault()
    const datos = { ...edicion, titulo: edicion.titulo.trim(), ubicacion: edicion.ubicacion.trim() }
    if (!datos.titulo || !datos.ubicacion) return
    // TODO BACKEND: crear/actualizar la oferta y usar el id devuelto por la API.
    // Sustituir crypto.randomUUID()/«Ahora» por id y fecha del servidor. Mostrar validaciones
    // y errores, bloquear envíos duplicados y cerrar/avisar éxito solo al guardar correctamente.
    setOfertas((actuales) => datos.id ? actuales.map((o) => o.id === datos.id ? datos : o) : [{ ...datos, id: crypto.randomUUID(), publicado: 'Ahora' }, ...actuales])
    setAviso('Oferta guardada en esta demostración.')
    setEdicion(null)
  }
  function eliminar(id) {
    // TODO BACKEND: eliminar o archivar la oferta tras confirmar; gestionar candidatos asociados.
    // Retirar la tarjeta solo tras la respuesta exitosa y mostrar errores/restricciones del servidor.
    setOfertas((actuales) => actuales.filter((o) => o.id !== id))
    setEliminarId(null)
    setAviso('Oferta eliminada de la demostración.')
  }
  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>Gestión de Ofertas</h2><p>Crea, edita y administra tus publicaciones activas.</p></div><button className="empresa-btn" onClick={() => setEdicion({ ...vacia })}>+ Nueva oferta</button></header>
    {edicion && <form className="tarjeta empresa-form" onSubmit={guardar} aria-label={edicion.id ? 'Editar oferta' : 'Nueva oferta'}><h3>{edicion.id ? 'Editar oferta' : 'Nueva oferta'}</h3>
      <div className="empresa-campos">{[['titulo', 'Título'], ['ubicacion', 'Ubicación'], ['salario', 'Salario (opcional)']].map(([campo, label]) => <label key={campo}>{label}<input autoFocus={campo === 'titulo'} required={campo !== 'salario'} value={edicion[campo]} onChange={(e) => setEdicion({ ...edicion, [campo]: e.target.value })} /></label>)}
      <label>Tipo<select value={edicion.tipo} onChange={(e) => setEdicion({ ...edicion, tipo: e.target.value })}><option>Empleo</option><option>Práctica</option><option>Servicio Social</option></select></label>
      <label>Etiquetas (separadas por comas)<input value={edicion.etiquetas.join(',')} onChange={(e) => setEdicion({ ...edicion, etiquetas: e.target.value.split(',') })} /></label>
      <label>Descripción<textarea value={edicion.descripcion ?? ''} onChange={(e) => setEdicion({ ...edicion, descripcion: e.target.value })} /></label></div>
      <div className="empresa-acciones"><button className="empresa-btn" type="submit">Guardar oferta</button><button className="empresa-btn-secundario" type="button" onClick={() => setEdicion(null)}>Cancelar</button></div>
    </form>}
    <p className="empresa-aviso" role="status">{aviso}</p>
    {/* TODO BACKEND: consultar ofertas paginadas con total de aplicantes por oferta;
        candidatos.filter() solo cuenta la lista local. Formatear publicado desde la fecha real. */}
    {ofertas.map((o) => <article className="tarjeta empresa-oferta" key={o.id}>
      <b className="siglas">{empresa.siglas}</b><div className="empresa-oferta-datos"><h3>{o.titulo}</h3><p>{o.ubicacion}{o.salario && ` · ${o.salario}`}</p><ul className="etiquetas">{o.etiquetas.filter((t) => t.trim()).map((t, i) => <li key={i}>{t.trim()}</li>)}</ul><div className="empresa-oferta-meta"><Link to={`/empresa/candidatos?oferta=${o.id}`}>{candidatos.filter((c) => c.ofertaId === o.id).length} aplicantes</Link><small>{o.publicado}</small><span className="empresa-estado">{o.tipo}</span></div></div>
      <div className="empresa-acciones"><span className={`empresa-estado ${o.activa ? 'estado-aceptado' : 'estado-pendiente'}`}>{o.activa ? 'Activa' : 'Pausada'}</span><button className="empresa-btn-secundario" onClick={() => {
        // TODO BACKEND: actualizar el estado de publicación de la oferta.
        // Reflejar el estado confirmado por la API y gestionar carga, error y permisos de publicación.
        setOfertas((actuales) => actuales.map((item) => item.id === o.id ? { ...item, activa: !item.activa } : item))
      }}>{o.activa ? 'Pausar' : 'Activar'}</button><button className="empresa-btn-secundario" onClick={() => setEdicion({ ...o })}>Editar</button><button className="empresa-btn-peligro" onClick={() => setEliminarId(o.id)}>Eliminar</button></div>
      {eliminarId === o.id && <div className="empresa-confirmacion"><p>¿Eliminar la oferta «{o.titulo}» de esta demostración?</p><button className="empresa-btn-peligro" onClick={() => eliminar(o.id)}>Sí, eliminar</button><button className="empresa-btn-secundario" onClick={() => setEliminarId(null)}>Cancelar</button></div>}
    </article>)}
    {ofertas.length === 0 && <p className="vacio">No tienes ofertas. Publica tu primera oportunidad.</p>}
  </section>
}
