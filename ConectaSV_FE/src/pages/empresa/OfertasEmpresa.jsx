import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

// TODO BACKEND: adaptar el formulario al contrato real (tipo, modalidad, salario/moneda,
// etiquetas y campos obligatorios). Las etiquetas de UI no son códigos definitivos de la API.
const OFERTA_VACIA = {
  titulo: '',
  ubicacion: '',
  salario: '',
  tipo: 'Empleo',
  etiquetas: [],
  descripcion: '',
  activa: true,
}

const CAMPOS_TEXTO = [
  ['titulo', 'Título'],
  ['ubicacion', 'Ubicación'],
  ['salario', 'Salario (opcional)'],
]

function FormularioOferta({ edicion, setEdicion, onGuardar, onCancelar }) {
  const titulo = edicion.id ? 'Editar oferta' : 'Nueva oferta'
  const cambiar = (campo, valor) => setEdicion({ ...edicion, [campo]: valor })

  return (
    <form className="tarjeta empresa-form" onSubmit={onGuardar} aria-label={titulo}>
      <h3>{titulo}</h3>

      <div className="empresa-campos">
        {CAMPOS_TEXTO.map(([campo, label]) => (
          <label key={campo}>
            {label}
            <input
              autoFocus={campo === 'titulo'}
              required={campo !== 'salario'}
              value={edicion[campo]}
              onChange={(e) => cambiar(campo, e.target.value)}
            />
          </label>
        ))}
        <label>
          Tipo
          <select value={edicion.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
            <option>Empleo</option>
            <option>Práctica</option>
            <option>Servicio Social</option>
          </select>
        </label>
        <label>
          Etiquetas (separadas por comas)
          <input
            value={edicion.etiquetas.join(',')}
            onChange={(e) => cambiar('etiquetas', e.target.value.split(','))}
          />
        </label>
        <label>
          Descripción
          <textarea
            value={edicion.descripcion ?? ''}
            onChange={(e) => cambiar('descripcion', e.target.value)}
          />
        </label>
      </div>

      <div className="empresa-acciones">
        <button className="empresa-btn" type="submit">Guardar oferta</button>
        <button className="empresa-btn-secundario" type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

function TarjetaOferta({ oferta, siglas, aplicantes, confirmandoEliminar, onCambiarEstado, onEditar, onPedirEliminar, onEliminar, onCancelarEliminar }) {
  const o = oferta

  return (
    <article className="tarjeta empresa-oferta">
      <b className="siglas">{siglas}</b>

      <div className="empresa-oferta-datos">
        <h3>{o.titulo}</h3>
        <p>{o.ubicacion}{o.salario && ` · ${o.salario}`}</p>
        <ul className="etiquetas">
          {o.etiquetas.filter((t) => t.trim()).map((t, i) => <li key={i}>{t.trim()}</li>)}
        </ul>
        <div className="empresa-oferta-meta">
          <Link to={`/empresa/candidatos?oferta=${o.id}`}>{aplicantes} aplicantes</Link>
          <small>{o.publicado}</small>
          <span className="empresa-estado">{o.tipo}</span>
        </div>
      </div>

      <div className="empresa-acciones">
        <span className={`empresa-estado ${o.activa ? 'estado-aceptado' : 'estado-pendiente'}`}>
          {o.activa ? 'Activa' : 'Pausada'}
        </span>
        <button className="empresa-btn-secundario" onClick={onCambiarEstado}>{o.activa ? 'Pausar' : 'Activar'}</button>
        <button className="empresa-btn-secundario" onClick={onEditar}>Editar</button>
        <button className="empresa-btn-peligro" onClick={onPedirEliminar}>Eliminar</button>
      </div>

      {confirmandoEliminar && (
        <div className="empresa-confirmacion">
          <p>¿Eliminar la oferta «{o.titulo}»?</p>
          <button className="empresa-btn-peligro" onClick={onEliminar}>Sí, eliminar</button>
          <button className="empresa-btn-secundario" onClick={onCancelarEliminar}>Cancelar</button>
        </div>
      )}
    </article>
  )
}

function OfertasEmpresa() {
  const { empresa, ofertas, candidatos } = useOutletContext()
  const [edicion, setEdicion] = useState(null)
  const [eliminarId, setEliminarId] = useState(null)
  const [aviso, setAviso] = useState('')

  function guardar(e) {
    e.preventDefault()
    const datos = { ...edicion, titulo: edicion.titulo.trim(), ubicacion: edicion.ubicacion.trim() }
    if (!datos.titulo || !datos.ubicacion) return

    // TODO BACKEND: crear/actualizar la oferta y usar el id devuelto por la API.
    // Obtener id y fecha del servidor. Mostrar validaciones
    // y errores, bloquear envíos duplicados y cerrar/avisar éxito solo al guardar correctamente.
    setAviso('El guardado de ofertas aún no está conectado. Tus cambios no se han guardado.')
  }

  function cambiarEstado() {
    // TODO BACKEND: actualizar el estado de publicación de la oferta.
    // Reflejar el estado confirmado por la API y gestionar carga, error y permisos de publicación.
    setAviso('El cambio de estado de ofertas aún no está conectado.')
  }

  function eliminar() {
    // TODO BACKEND: eliminar por eliminarId y actualizar el listado tras confirmar la API.
    setAviso('La eliminación de ofertas aún no está conectada.')
  }

  // TODO BACKEND: consultar ofertas paginadas con total de aplicantes por oferta;
  // candidatos.filter() solo cuenta la lista local. Formatear publicado desde la fecha real.
  const aplicantesDe = (ofertaId) => candidatos.filter((c) => c.ofertaId === ofertaId).length

  return (
    <section className="empresa-vista">
      <header className="empresa-encabezado">
        <div>
          <h2>Gestión de Ofertas</h2>
          <p>Crea, edita y administra tus publicaciones activas.</p>
        </div>
        <button className="empresa-btn" onClick={() => setEdicion({ ...OFERTA_VACIA })}>+ Nueva oferta</button>
      </header>

      {edicion && (
        <FormularioOferta
          edicion={edicion}
          setEdicion={setEdicion}
          onGuardar={guardar}
          onCancelar={() => setEdicion(null)}
        />
      )}

      <p className="empresa-aviso" role="status">{aviso}</p>

      {ofertas.map((o) => (
        <TarjetaOferta
          key={o.id}
          oferta={o}
          siglas={empresa.siglas}
          aplicantes={aplicantesDe(o.id)}
          confirmandoEliminar={eliminarId === o.id}
          onCambiarEstado={cambiarEstado}
          onEditar={() => setEdicion({ ...o })}
          onPedirEliminar={() => setEliminarId(o.id)}
          onEliminar={eliminar}
          onCancelarEliminar={() => setEliminarId(null)}
        />
      ))}

      {ofertas.length === 0 && <p className="vacio">No tienes ofertas. Publica tu primera oportunidad.</p>}
    </section>
  )
}

export default OfertasEmpresa
