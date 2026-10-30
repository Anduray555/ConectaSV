import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconPin } from '../../assets/icons/dashboard/Iconos'

const campos = [
  ['nombre', 'Nombre de empresa'], ['descripcion', 'Descripción breve'],
  ['ubicacion', 'Ubicación'], ['web', 'Sitio web'], ['correo', 'Correo RRHH'],
  ['telefono', 'Teléfono'], ['tamano', 'Tamaño'],
]

// El formulario solo se monta al editar: nunca recibe un borrador null.
export function FormularioPerfilEmpresa({ empresa, onCancelar }) {
  const [edicion, setEdicion] = useState(() => ({
    ...empresa,
    sectores: Array.isArray(empresa?.sectores) ? empresa.sectores : [],
  }))
  const [aviso, setAviso] = useState('')

  function guardar(e) {
    e.preventDefault()
    if (!edicion.nombre?.trim()) return
    // TODO BACKEND: persistir el perfil y confirmar éxito con la respuesta de la API.
    setAviso('El guardado del perfil aún no está conectado. Tus cambios no se han guardado.')
  }

  return <form className="tarjeta empresa-form" onSubmit={guardar} aria-label="Editar perfil de empresa">
    <h3>Editar perfil</h3>
    <div className="empresa-campos">
      {campos.map(([campo, label]) => <label key={campo}>{label}
        <input type={campo === 'correo' ? 'email' : campo === 'telefono' ? 'tel' : 'text'} required
          value={edicion[campo] ?? ''}
          onChange={(e) => setEdicion({ ...edicion, [campo]: e.target.value })} />
      </label>)}
      <label>Sectores (separados por comas)
        <input value={edicion.sectores.join(',')} onChange={(e) => setEdicion({ ...edicion, sectores: e.target.value.split(',') })} />
      </label>
      <label className="empresa-campo-ancho">Sobre la empresa
        <textarea required value={edicion.acerca ?? ''} onChange={(e) => setEdicion({ ...edicion, acerca: e.target.value })} />
      </label>
    </div>
    <div className="empresa-acciones">
      <button className="empresa-btn" type="submit">Guardar perfil</button>
      <button type="button" className="empresa-btn-secundario" onClick={onCancelar}>Cancelar</button>
    </div>
    <p className="empresa-aviso" role="status">{aviso}</p>
  </form>
}

export default function PerfilEmpresa() {
  const contexto = useOutletContext()
  const empresa = contexto?.empresa ?? {}
  const resumen = contexto?.resumen ?? {}
  const sectores = Array.isArray(empresa.sectores) ? empresa.sectores.filter((s) => typeof s === 'string' && s.trim()) : []
  const [editando, setEditando] = useState(false)
  const estadisticas = [
    [resumen.ofertasPublicadas, 'Ofertas publicadas'],
    [resumen.aplicantes, 'Aplicantes totales'],
    [resumen.aceptados, 'Aceptados'],
  ]

  return <section className="perfil empresa-perfil">
    <article className="tarjeta perfil-principal">
      <header>
        <b className="avatar-grande">{empresa.siglas || '—'}</b>
        <h2>{empresa.nombre || 'Perfil sin cargar'}</h2>
        <p>{empresa.descripcion}</p>
        <p className="ubicacion"><IconPin />{empresa.ubicacion}</p>
        <button type="button" className="btn-contorno" onClick={() => setEditando(true)}>Editar perfil</button>
      </header>
      <ul className="estadisticas">{estadisticas.map(([numero, label]) => <li key={label}><strong>{numero ?? '—'}</strong>{label}</li>)}</ul>
    </article>
    {editando && <FormularioPerfilEmpresa empresa={empresa} onCancelar={() => setEditando(false)} />}
    <section className="tarjeta"><h3>Sobre la empresa</h3><p>{empresa.acerca || 'Sin descripción.'}</p></section>
    <section className="tarjeta"><h3>Sectores</h3>
      {sectores.length === 0 && <p>Sin sectores registrados.</p>}
      <ul className="etiquetas">{sectores.map((s, i) => <li key={i}>{s.trim()}</li>)}</ul>
    </section>
    <section className="tarjeta"><h3>Información de contacto</h3>
      <dl className="empresa-contacto">{[['Sitio web', empresa.web], ['Correo RRHH', empresa.correo], ['Teléfono', empresa.telefono], ['Tamaño', empresa.tamano]].map(([label, valor]) => <div key={label}><dt>{label}</dt><dd>{valor || '—'}</dd></div>)}</dl>
    </section>
  </section>
}
