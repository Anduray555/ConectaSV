import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { tiposDocumento } from '../../data/empresa'
import { IconDocumentos } from '../../assets/icons/dashboard/Iconos'

const TAMANO_MAXIMO = 10 * 1024 * 1024 // 10 MB

// Cuántos documentos del expediente ya tienen archivo.
const contarListos = (documentos) => tiposDocumento.filter((tipo) => documentos?.[tipo.id]?.url).length

function ItemEstudiante({ expediente, estudiante, activo, onSeleccionar }) {
  return (
    <li>
      <button className={activo ? 'activo' : ''} onClick={onSeleccionar}>
        <b className="siglas">{estudiante?.siglas || '—'}</b>
        <span>
          <strong>{estudiante?.nombre || 'Sin información del estudiante'}</strong>
          <small>{contarListos(expediente.documentos)} de {tiposDocumento.length} listos</small>
        </span>
      </button>
    </li>
  )
}

function TarjetaDocumento({ tipo, doc, habilitado, onVer, onGenerar, onCargar }) {
  const listo = Boolean(doc?.url)

  return (
    <article className="tarjeta empresa-documento">
      <span className="empresa-doc-icono"><IconDocumentos /></span>

      <div>
        <h3>
          {tipo.titulo}{' '}
          <span className={`empresa-estado ${listo ? 'estado-aceptado' : 'estado-pendiente'}`}>
            {listo ? 'Listo' : 'Pendiente'}
          </span>
        </h3>
        <p>{doc ? [doc.fuente, doc.fecha].filter(Boolean).join(' · ') : 'Sin documento disponible.'}</p>
        {doc?.nombre && <small>{doc.nombre}</small>}
      </div>

      <div className="empresa-acciones">
        {listo ? (
          <button className="empresa-btn-secundario" onClick={onVer}>Ver</button>
        ) : (
          <button disabled={!habilitado} className="empresa-btn-secundario" onClick={onGenerar}>Generar</button>
        )}
        <label className="empresa-btn-secundario empresa-cargar">
          {doc ? 'Reemplazar' : 'Cargar PDF'}
          <input
            type="file"
            disabled={!habilitado}
            accept="application/pdf"
            aria-label={`Cargar ${tipo.titulo}`}
            onChange={onCargar}
          />
        </label>
      </div>
    </article>
  )
}

function DocumentosEmpresa() {
  const { candidatos, expedientes } = useOutletContext()
  const [seleccionado, setSeleccionado] = useState(null)
  const [vista, setVista] = useState(null)
  const [aviso, setAviso] = useState('')

  const estudianteDe = (exp) => exp?.estudiante ?? candidatos.find((c) => c.id === exp?.estudianteId)

  const expediente = expedientes.find((e) => e.estudianteId === seleccionado) ?? expedientes[0]
  const estudiante = estudianteDe(expediente)
  const documentos = expediente?.documentos ?? {}
  const completos = contarListos(documentos)
  const documentoEnVista = vista && documentos[vista]?.url ? documentos[vista] : null

  function seleccionar(estudianteId) {
    setSeleccionado(estudianteId)
    setVista(null)
    setAviso('')
  }

  function cargar(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    if (archivo.type !== 'application/pdf' || archivo.size > TAMANO_MAXIMO) {
      setAviso('Selecciona un PDF de hasta 10 MB.')
    } else {
      // TODO BACKEND: subir archivo para expediente.estudianteId y el tipo seleccionado.
      // Actualizar el expediente solo con la respuesta del servidor.
      setAviso('La carga de documentos aún no está conectada. El archivo no se ha guardado.')
    }
    e.target.value = ''
  }

  return (
    <section className="empresa-vista">
      <header className="empresa-encabezado">
        <div>
          <h2>Documentos de servicio social</h2>
          <p>Administra los documentos de cada estudiante seleccionado.</p>
        </div>
        <span className="empresa-estado">{tiposDocumento.length} tipos de documento obligatorios</span>
      </header>

      <div className="empresa-expedientes">
        <aside className="tarjeta empresa-estudiantes">
          <header>
            <h3>Estudiantes seleccionados</h3>
            <p>{expedientes.length} expedientes</p>
          </header>
          <ul>
            {expedientes.map((e) => (
              <ItemEstudiante
                key={e.estudianteId}
                expediente={e}
                estudiante={estudianteDe(e)}
                activo={expediente?.estudianteId === e.estudianteId}
                onSeleccionar={() => seleccionar(e.estudianteId)}
              />
            ))}
          </ul>
          {expedientes.length === 0 && <p className="vacio">No hay expedientes asignados.</p>}
        </aside>

        <div className="empresa-vista">
          <header className="tarjeta empresa-expediente-cabecera">
            <b className="siglas">{estudiante?.siglas || '—'}</b>
            <div>
              <h3>{estudiante?.nombre || 'Sin estudiante seleccionado'}</h3>
              <p>{expediente?.proyecto || 'Sin proyecto asignado'}</p>
            </div>
            <div className="empresa-progreso">
              <small>Progreso</small>
              <strong>{completos} / {tiposDocumento.length}</strong>
            </div>
          </header>

          {tiposDocumento.map((tipo) => (
            <TarjetaDocumento
              key={tipo.id}
              tipo={tipo}
              doc={documentos[tipo.id]}
              habilitado={Boolean(expediente)}
              onVer={() => setVista(tipo.id)}
              onGenerar={() => setAviso('La generación de documentos aún no está conectada.')}
              onCargar={cargar}
            />
          ))}

          <p className="empresa-aviso" role="status">{aviso}</p>

          {documentoEnVista && (
            <section className="tarjeta empresa-preview">
              <header className="empresa-seccion-titulo">
                <h3>{tiposDocumento.find((t) => t.id === vista)?.titulo}</h3>
                <button className="empresa-btn-secundario" onClick={() => setVista(null)}>Cerrar vista previa</button>
              </header>
              <iframe title="PDF de empresa" src={documentoEnVista.url} />
            </section>
          )}
        </div>
      </div>
    </section>
  )
}

export default DocumentosEmpresa
