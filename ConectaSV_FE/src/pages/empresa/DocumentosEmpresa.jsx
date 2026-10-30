import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { tiposDocumento } from '../../data/empresa'
import { IconDocumentos } from '../../assets/icons/dashboard/Iconos'

export default function DocumentosEmpresa() {
  const { candidatos, expedientes } = useOutletContext()
  const [seleccionado, setSeleccionado] = useState(null)
  const [vista, setVista] = useState(null)
  const [aviso, setAviso] = useState('')
  const expediente = expedientes.find((e) => e.estudianteId === seleccionado) ?? expedientes[0]
  const estudiante = expediente?.estudiante ?? candidatos.find((c) => c.id === expediente?.estudianteId)
  const documentos = expediente?.documentos ?? {}
  const completos = tiposDocumento.filter((tipo) => documentos[tipo.id]?.url).length

  function cargar(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (archivo.type !== 'application/pdf' || archivo.size > 10 * 1024 * 1024) {
      setAviso('Selecciona un PDF de hasta 10 MB.')
    } else {
      // TODO BACKEND: subir archivo para expediente.estudianteId y el tipo seleccionado.
      // Actualizar el expediente solo con la respuesta del servidor.
      setAviso('La carga de documentos aún no está conectada. El archivo no se ha guardado.')
    }
    e.target.value = ''
  }

  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>Documentos de servicio social</h2><p>Administra los documentos de cada estudiante seleccionado.</p></div><span className="empresa-estado">{tiposDocumento.length} tipos de documento obligatorios</span></header>
    <div className="empresa-expedientes">
      <aside className="tarjeta empresa-estudiantes"><header><h3>Estudiantes seleccionados</h3><p>{expedientes.length} expedientes</p></header>
        <ul>{expedientes.map((e) => {
          const c = e.estudiante ?? candidatos.find((item) => item.id === e.estudianteId)
          const n = tiposDocumento.filter((tipo) => e.documentos?.[tipo.id]?.url).length
          return <li key={e.estudianteId}><button className={expediente?.estudianteId === e.estudianteId ? 'activo' : ''} onClick={() => { setSeleccionado(e.estudianteId); setVista(null); setAviso('') }}>
            <b className="siglas">{c?.siglas || '—'}</b><span><strong>{c?.nombre || 'Sin información del estudiante'}</strong><small>{n} de {tiposDocumento.length} listos</small></span>
          </button></li>
        })}</ul>{expedientes.length === 0 && <p className="vacio">No hay expedientes asignados.</p>}
      </aside>
      <div className="empresa-vista">
        <header className="tarjeta empresa-expediente-cabecera"><b className="siglas">{estudiante?.siglas || '—'}</b><div><h3>{estudiante?.nombre || 'Sin estudiante seleccionado'}</h3><p>{expediente?.proyecto || 'Sin proyecto asignado'}</p></div><div className="empresa-progreso"><small>Progreso</small><strong>{completos} / {tiposDocumento.length}</strong></div></header>
        {tiposDocumento.map((tipo) => {
          const doc = documentos[tipo.id]
          return <article className="tarjeta empresa-documento" key={tipo.id}>
            <span className="empresa-doc-icono"><IconDocumentos /></span>
            <div><h3>{tipo.titulo} <span className={`empresa-estado ${doc?.url ? 'estado-aceptado' : 'estado-pendiente'}`}>{doc?.url ? 'Listo' : 'Pendiente'}</span></h3><p>{doc ? [doc.fuente, doc.fecha].filter(Boolean).join(' · ') : 'Sin documento disponible.'}</p>{doc?.nombre && <small>{doc.nombre}</small>}</div>
            <div className="empresa-acciones">
              {doc?.url ? <button className="empresa-btn-secundario" onClick={() => setVista(tipo.id)}>Ver</button> : <button disabled={!expediente} className="empresa-btn-secundario" onClick={() => setAviso('La generación de documentos aún no está conectada.')}>Generar</button>}
              <label className="empresa-btn-secundario empresa-cargar">{doc ? 'Reemplazar' : 'Cargar PDF'}<input type="file" disabled={!expediente} accept="application/pdf" aria-label={`Cargar ${tipo.titulo}`} onChange={cargar} /></label>
            </div>
          </article>
        })}
        <p className="empresa-aviso" role="status">{aviso}</p>
        {vista && documentos[vista]?.url && <section className="tarjeta empresa-preview"><header className="empresa-seccion-titulo"><h3>{tiposDocumento.find((t) => t.id === vista)?.titulo}</h3><button className="empresa-btn-secundario" onClick={() => setVista(null)}>Cerrar vista previa</button></header><iframe title="PDF de empresa" src={documentos[vista].url} /></section>}
      </div>
    </div>
  </section>
}
