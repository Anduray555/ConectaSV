import { useOutletContext } from 'react-router-dom'
import { tiposDocumento } from '../../data/empresa'
import { IconCarta, IconDocumentos, IconCalendario } from '../../assets/icons/dashboard/Iconos'

const iconos = { carta: IconCarta, proyecto: IconDocumentos, plan: IconCalendario }

export default function DocumentosSS() {
  const { expediente } = useOutletContext()
  const documentos = expediente?.documentos ?? {}
  const completo = tiposDocumento.every((tipo) => documentos[tipo.id]?.url)

  return <section className="expediente-ss" aria-labelledby="expediente-titulo">
    <header className="expediente-encabezado"><div>
      <p className="expediente-antetitulo">Expediente de servicio social</p>
      <h2 id="expediente-titulo">Tus documentos de servicio social</h2>
      <p className="expediente-descripcion">{expediente ? 'Revisa los documentos de tu proyecto.' : 'Aún no hay un proyecto asignado.'}</p>
    </div>{expediente && <span className="expediente-completo">{completo ? 'Expediente completo' : 'Documentos pendientes'}</span>}</header>
    <section className="expediente-proyecto" aria-label="Proyecto de servicio social">
      <span className="expediente-logo">{expediente?.siglas || '—'}</span>
      <div className="expediente-empresa"><h3>{expediente?.empresa || 'Sin institución asignada'}</h3><p>Proyecto: {expediente?.proyecto || '—'}</p></div>
      <dl><div><dt>Período</dt><dd>{expediente?.periodo || '—'}</dd></div><div><dt>Horas</dt><dd>{expediente?.horas == null ? '—' : `${expediente.horas} horas`}</dd></div></dl>
    </section>
    <div className="expediente-documentos">{tiposDocumento.map((tipo, indice) => {
      const doc = documentos[tipo.id]
      const Icono = iconos[tipo.id]
      return <article className="expediente-documento" key={tipo.id}>
        <div className="expediente-documento-cabecera"><span className="expediente-icono"><Icono /></span><span>{doc?.url ? 'Disponible' : 'Pendiente'}</span></div>
        <p className="expediente-numero">Documento {indice + 1} de {tiposDocumento.length}</p>
        <h3>{tipo.titulo}</h3>
        <div className="expediente-metadatos"><span>{doc?.peso || '—'}</span><span>{doc?.fecha || '—'}</span></div>
        <div className="expediente-acciones">{doc?.url ? <>
          <a href={doc.url} target="_blank" rel="noreferrer">Revisar</a>
          <a href={doc.url} download={doc.nombre}>Descargar</a>
        </> : <><button type="button" disabled>Revisar</button><button type="button" disabled>Descargar</button></>}</div>
      </article>
    })}</div>
    <aside className="expediente-ayuda"><span aria-hidden="true">i</span><div><h3>¿Encontraste un dato incorrecto?</h3><p>Solicita la actualización a la empresa responsable desde Mensajes.</p></div></aside>
  </section>
}
