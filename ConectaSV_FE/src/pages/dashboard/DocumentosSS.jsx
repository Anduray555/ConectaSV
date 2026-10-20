import { useState } from 'react'
import { IconCarta, IconDocumentos, IconCalendario } from '../../assets/icons/dashboard/Iconos'

// TODO BACKEND: sustituir este expediente por el proyecto asignado al estudiante autenticado.
const expediente = {
  empresa: 'Banco Agrícola', siglas: 'BA',
  proyecto: 'Digitalización de procesos administrativos',
  periodo: '2 sep — 13 dic 2024', horas: 300,
}

// TODO BACKEND: obtener los documentos de la empresa (id, estado, tamaño, fecha y URL del PDF).
// El estado «Expediente completo» deberá calcularse según los tres documentos requeridos.
const documentos = [
  { id: 'carta', titulo: 'Carta de solicitud', descripcion: 'Solicitud formal para iniciar el proceso de servicio social.', peso: '184 KB', fecha: '22 ago 2024', Icono: IconCarta },
  { id: 'proyecto', titulo: 'Perfil del proyecto', descripcion: 'Alcance, objetivos y datos generales del proyecto asignado.', peso: '326 KB', fecha: '22 ago 2024', Icono: IconDocumentos },
  { id: 'plan', titulo: 'Plan de trabajo', descripcion: 'Actividades, responsables y cronograma para completar 300 horas.', peso: '248 KB', fecha: '23 ago 2024', Icono: IconCalendario },
]

function IconAccion({ descargar = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {descargar ? <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M5 15v5h14v-5" /></> : <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
    </svg>
  )
}

function DocumentosSS() {
  const [aviso, setAviso] = useState('')

  function gestionarDocumento(documento, accion) {
    // TODO BACKEND: para revisar, abrir el PDF de la empresa en un visor.
    // Para descargar, solicitar el archivo/URL autorizada y descargarlo con su nombre real.
    // Añadir estados de carga, documento no disponible y errores de la petición.
    setAviso(`${documento.titulo}: la ${accion === 'revisar' ? 'vista previa' : 'descarga'} estará disponible cuando se conecten los documentos de la empresa.`)
  }

  return (
    <section className="expediente-ss" aria-labelledby="expediente-titulo">
      <header className="expediente-encabezado">
        <div>
          <p className="expediente-antetitulo">Expediente de servicio social</p>
          <h2 id="expediente-titulo">Tus documentos están listos</h2>
          <p className="expediente-descripcion">{expediente.empresa} preparó los tres documentos requeridos para tu proyecto. Puedes revisarlos y descargarlos; cualquier modificación debe solicitarse a la empresa.</p>
        </div>
        <span className="expediente-completo"><span aria-hidden="true">✓</span> Expediente completo</span>
      </header>

      <section className="expediente-proyecto" aria-label="Proyecto de servicio social">
        <span className="expediente-logo" aria-hidden="true">{expediente.siglas}</span>
        <div className="expediente-empresa"><h3>{expediente.empresa}</h3><p>Proyecto: {expediente.proyecto}</p></div>
        <dl><div><dt>Período</dt><dd>{expediente.periodo}</dd></div><div><dt>Horas</dt><dd>{expediente.horas} horas</dd></div></dl>
      </section>

      <div className="expediente-documentos">
        {documentos.map(({ Icono, ...documento }, indice) => (
          <article className="expediente-documento" key={documento.id} aria-labelledby={`titulo-${documento.id}`}>
            <div className="expediente-documento-cabecera"><span className="expediente-icono" aria-hidden="true"><Icono /></span><span className="expediente-disponible">Disponible</span></div>
            <p className="expediente-numero">Documento {indice + 1} de {documentos.length}</p>
            <h3 id={`titulo-${documento.id}`}>{documento.titulo}</h3>
            <p className="expediente-documento-descripcion">{documento.descripcion}</p>
            <div className="expediente-metadatos"><span>PDF · {documento.peso}</span><span>{documento.fecha}</span></div>
            <div className="expediente-acciones">
              <button type="button" onClick={() => gestionarDocumento(documento, 'revisar')} aria-label={`Revisar ${documento.titulo}`}><IconAccion />Revisar</button>
              <button type="button" className="expediente-descargar" onClick={() => gestionarDocumento(documento, 'descargar')} aria-label={`Descargar ${documento.titulo}`}><IconAccion descargar />Descargar</button>
            </div>
          </article>
        ))}
      </div>

      <aside className="expediente-ayuda"><span aria-hidden="true">i</span><div><h3>¿Encontraste un dato incorrecto?</h3><p>Escribe a {expediente.empresa} desde Mensajes. Solo la empresa puede actualizar los documentos de este expediente.</p></div></aside>
      <p className="expediente-aviso" role="status">{aviso}</p>
    </section>
  )
}

export default DocumentosSS
