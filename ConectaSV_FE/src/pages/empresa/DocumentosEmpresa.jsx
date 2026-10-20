import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { tiposDocumento } from '../../data/empresa.mock'
import { IconDocumentos } from '../../assets/icons/dashboard/Iconos'
import HojaDocumento from '../../components/dashboard/HojaDocumento'

export default function DocumentosEmpresa() {
  const { empresa, candidatos, expedientes, setExpedientes, archivoUrls } = useOutletContext()
  // TODO BACKEND: cargar expedientes de estudiantes seleccionados para servicio social;
  // resolver sus datos desde el expediente, sin depender de la lista paginada de candidatos.
  // Seleccionar el primero tras cargar y manejar respuestas vacías, errores y cambios de estudiante.
  const [seleccionado, setSeleccionado] = useState(expedientes[0]?.estudianteId)
  const [vista, setVista] = useState(null)
  const [aviso, setAviso] = useState('')
  const expediente = expedientes.find((e) => e.estudianteId === seleccionado)
  const estudiante = candidatos.find((c) => c.id === seleccionado)
  // TODO BACKEND: considerar el estado real de cada archivo (pendiente, procesando, listo o error);
  // la existencia de metadatos por sí sola no confirma que el documento esté disponible.
  const completos = expediente ? tiposDocumento.filter((t) => expediente.documentos[t.id]).length : 0

  function guardarDocumento(tipo, documento) {
    // TODO BACKEND: generar el PDF o subirlo como multipart/form-data para este estudiante y tipo.
    // Guardar el id/URL/fecha devueltos por la API y validar permisos y archivos en el servidor.
    // Separar generación y carga/reemplazo según el contrato; actualizar el expediente y avisar
    // éxito solo tras persistir. Incorporar carga, errores y confirmación de reemplazo si corresponde.
    setExpedientes((actuales) => actuales.map((e) => e.estudianteId === seleccionado ? { ...e, documentos: { ...e.documentos, [tipo]: documento } } : e))
    setVista(null)
  }
  function cargar(e, tipo) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    // TODO BACKEND: alinear tipo y límite con la API; el servidor debe validar contenido y tamaño.
    if (archivo.type !== 'application/pdf' || archivo.size > 10 * 1024 * 1024) {
      setAviso('Selecciona un PDF de hasta 10 MB.'); e.target.value = ''; return
    }
    // TODO BACKEND: subir el archivo real; esta URL blob no lo almacena en el servidor.
    // Sustituir fuente/fecha/nombre/url locales por los metadatos confirmados por la API.
    const url = URL.createObjectURL(archivo)
    archivoUrls.current.push(url)
    guardarDocumento(tipo, { fuente: 'Documento de empresa', fecha: 'Ahora', nombre: archivo.name, url })
    setAviso(`PDF «${archivo.name}» cargado únicamente en esta demostración.`)
    e.target.value = ''
  }

  return <section className="empresa-vista">
    <header className="empresa-encabezado"><div><h2>Documentos de servicio social</h2><p>Genera con ConectaSV o carga los documentos de tu empresa para cada estudiante seleccionado.</p></div><span className="empresa-estado">3 tipos de documento obligatorios</span></header>
    <div className="empresa-expedientes">
      <aside className="tarjeta empresa-estudiantes"><header><h3>Estudiantes seleccionados</h3><p>{expedientes.length} expedientes activos</p></header><ul>{expedientes.map((e) => { const c = candidatos.find((item) => item.id === e.estudianteId); const n = tiposDocumento.filter((t) => e.documentos[t.id]).length; return <li key={e.estudianteId}><button className={seleccionado === e.estudianteId ? 'activo' : ''} aria-pressed={seleccionado === e.estudianteId} onClick={() => { setSeleccionado(e.estudianteId); setVista(null); setAviso('') }}><b className="siglas">{c.siglas}</b><span><strong>{c.nombre}</strong><small>{n} de 3 listos</small></span><span className={`empresa-estado ${n === 3 ? 'estado-aceptado' : 'estado-pendiente'}`}>{n}/3</span></button></li> })}</ul></aside>
      {expediente && <div className="empresa-vista"><header className="tarjeta empresa-expediente-cabecera"><b className="siglas">{estudiante.siglas}</b><div><h3>{estudiante.nombre}</h3><p>{expediente.proyecto}</p></div><div className="empresa-progreso"><small>Progreso</small><strong>{completos} / 3</strong></div></header>
        {/* TODO BACKEND: «Generar ejemplo» debe solicitar el PDF definitivo con los datos reales;
            no marcarlo listo creando solo metadatos. Formatear fechas reales de actualización. */}
        {tiposDocumento.map((tipo) => { const doc = expediente.documentos[tipo.id]; return <article className="tarjeta empresa-documento" key={tipo.id}><span className="empresa-doc-icono"><IconDocumentos /></span><div><h3>{tipo.titulo} <span className={`empresa-estado ${doc ? 'estado-aceptado' : 'estado-pendiente'}`}>{doc ? 'Listo' : 'Pendiente'}</span></h3><p>{doc ? `${doc.fuente} · Actualizado ${doc.fecha}` : 'Genera una plantilla o carga el PDF oficial.'}</p>{doc?.nombre && <small>{doc.nombre}</small>}</div><div className="empresa-acciones">{doc ? <button className="empresa-btn-secundario" onClick={() => setVista(tipo.id)}>Ver</button> : <button className="empresa-btn-secundario" onClick={() => { guardarDocumento(tipo.id, { fuente: 'ConectaSV · plantilla de ejemplo', fecha: 'Ahora' }); setAviso('Plantilla de ejemplo preparada. La generación del PDF definitivo queda pendiente del backend.') }}>Generar ejemplo</button>}<label className="empresa-btn-secundario empresa-cargar">{doc ? 'Reemplazar' : 'Cargar PDF'}<input type="file" accept="application/pdf" aria-label={`${doc ? 'Reemplazar' : 'Cargar'} ${tipo.titulo}`} onChange={(e) => cargar(e, tipo.id)} /></label></div></article> })}
        <aside className="tarjeta empresa-nota"><h3>Los tres tipos siempre se mantienen</h3><p>Aunque reemplaces un archivo generado por uno propio, el expediente conservará Carta de solicitud, Perfil del proyecto y Plan de trabajo.</p></aside>
        <p className="empresa-aviso" role="status">{aviso}</p>
        {/* TODO BACKEND: obtener el PDF por id con autorización/URL vigente y manejar archivo
            inexistente o URL expirada. Retirar HojaDocumento de ejemplo y sus valores fijos
            (carné, tutor, teléfono, horas y fechas); usar el documento oficial del expediente. */}
        {vista && <section className="tarjeta empresa-preview" aria-label="Vista previa del documento"><header className="empresa-seccion-titulo"><h3>{tiposDocumento.find((t) => t.id === vista).titulo}</h3><button className="empresa-btn-secundario" onClick={() => setVista(null)}>Cerrar vista previa</button></header>{expediente.documentos[vista].url ? <iframe title="PDF de empresa" src={expediente.documentos[vista].url} /> : <><p className="empresa-aviso">Vista de ejemplo. El PDF oficial se obtendrá del backend.</p><HojaDocumento doc={vista} datos={{ nombre: estudiante.nombre, carne: 'Ejemplo', carrera: estudiante.carrera, universidad: estudiante.universidad, institucion: empresa.nombre, direccion: empresa.ubicacion, tutor: 'Tutor de ejemplo', telTutor: empresa.telefono, proyecto: expediente.proyecto, horas: 300, inicio: '2024-09-02', fin: '2024-12-13' }} /></>}</section>}
      </div>}
    </div>
  </section>
}

