import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconPin } from '../../assets/icons/dashboard/Iconos'

export default function PerfilEmpresa() {
  const { empresa, setEmpresa, ofertas, candidatos } = useOutletContext()
  const [edicion, setEdicion] = useState(null)
  const [aviso, setAviso] = useState('')
  // TODO BACKEND: obtener estadísticas globales de la empresa, no contar listas paginadas.
  const estadisticas = [[ofertas.length, 'Ofertas publicadas'], [candidatos.length, 'Aplicantes totales'], [candidatos.filter((c) => c.estado === 'Aceptado').length, 'Aceptados']]
  function guardar(e) {
    e.preventDefault()
    if (!edicion.nombre.trim()) return
    // TODO BACKEND: actualizar el perfil de empresa y renderizar la respuesta del servidor.
    // Adaptar sectores/contacto al contrato de la API, mostrar errores por campo y estado
    // de guardado; cerrar el formulario y mostrar éxito solo tras confirmar la persistencia.
    setEmpresa({ ...edicion, nombre: edicion.nombre.trim() }); setEdicion(null); setAviso('Perfil actualizado en esta demostración.')
  }
  return <section className="perfil empresa-perfil">
    <article className="tarjeta perfil-principal"><header><b className="avatar-grande">{empresa.siglas}</b><h2>{empresa.nombre}</h2><p>{empresa.descripcion}</p><p className="ubicacion"><IconPin />{empresa.ubicacion}</p><button className="btn-contorno" onClick={() => setEdicion({ ...empresa })}>Editar perfil</button></header><ul className="estadisticas">{estadisticas.map(([numero, label]) => <li key={label}><strong>{numero}</strong>{label}</li>)}</ul></article>
    {edicion && <form className="tarjeta empresa-form" onSubmit={guardar} aria-label="Editar perfil de empresa"><h3>Editar perfil</h3><div className="empresa-campos">{[['nombre', 'Nombre de empresa'], ['descripcion', 'Descripción breve'], ['ubicacion', 'Ubicación'], ['web', 'Sitio web'], ['correo', 'Correo RRHH'], ['telefono', 'Teléfono'], ['tamano', 'Tamaño']].map(([campo, label]) => <label key={campo}>{label}<input type={campo === 'correo' ? 'email' : campo === 'telefono' ? 'tel' : 'text'} required value={edicion[campo]} onChange={(e) => setEdicion({ ...edicion, [campo]: e.target.value })} /></label>)}<label>Sectores (separados por comas)<input value={edicion.sectores.join(',')} onChange={(e) => setEdicion({ ...edicion, sectores: e.target.value.split(',') })} /></label><label className="empresa-campo-ancho">Sobre la empresa<textarea required value={edicion.acerca} onChange={(e) => setEdicion({ ...edicion, acerca: e.target.value })} /></label></div><div className="empresa-acciones"><button className="empresa-btn" type="submit">Guardar perfil</button><button type="button" className="empresa-btn-secundario" onClick={() => setEdicion(null)}>Cancelar</button></div></form>}
    <p className="empresa-aviso" role="status">{aviso}</p>
    <section className="tarjeta"><h3>Sobre la empresa</h3><p>{empresa.acerca}</p></section>
    <section className="tarjeta"><h3>Sectores</h3><ul className="etiquetas">{empresa.sectores.filter((s) => s.trim()).map((s, i) => <li key={i}>{s.trim()}</li>)}</ul></section>
    <section className="tarjeta"><h3>Información de contacto</h3><dl className="empresa-contacto">{[['Sitio web', empresa.web], ['Correo RRHH', empresa.correo], ['Teléfono', empresa.telefono], ['Tamaño', empresa.tamano]].map(([label, valor]) => <div key={label}><dt>{label}</dt><dd>{valor}</dd></div>)}</dl></section>
  </section>
}
