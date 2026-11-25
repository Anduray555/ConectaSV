import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconPin } from '../../assets/icons/dashboard/Iconos'
import AvatarEditable from '../../components/perfil/AvatarEditable'
import { logoApi } from '../../api/images'
import useAuth from '../../hooks/useAuth'

const CAMPOS = [
  ['nombre', 'Nombre de empresa'],
  ['descripcion', 'Descripción breve'],
  ['ubicacion', 'Ubicación'],
  ['web', 'Sitio web'],
  ['correo', 'Correo RRHH'],
  ['telefono', 'Teléfono'],
  ['tamano', 'Tamaño'],
]

const TIPO_INPUT = { correo: 'email', telefono: 'tel' }

// El formulario solo se monta al editar: nunca recibe un borrador null.
export function FormularioPerfilEmpresa({ empresa, onCancelar }) {
  const [edicion, setEdicion] = useState(() => ({
    ...empresa,
    sectores: Array.isArray(empresa?.sectores) ? empresa.sectores : [],
  }))
  const [aviso, setAviso] = useState('')

  const cambiar = (campo, valor) => setEdicion({ ...edicion, [campo]: valor })

  function guardar(e) {
    e.preventDefault()
    if (!edicion.nombre?.trim()) return
    // TODO BACKEND: persistir el perfil y confirmar éxito con la respuesta de la API.
    setAviso('El guardado del perfil aún no está conectado. Tus cambios no se han guardado.')
  }

  return (
    <form className="tarjeta empresa-form" onSubmit={guardar} aria-label="Editar perfil de empresa">
      <h3>Editar perfil</h3>

      <div className="empresa-campos">
        {CAMPOS.map(([campo, label]) => (
          <label key={campo}>
            {label}
            <input
              type={TIPO_INPUT[campo] ?? 'text'}
              required
              value={edicion[campo] ?? ''}
              onChange={(e) => cambiar(campo, e.target.value)}
            />
          </label>
        ))}
        <label>
          Sectores (separados por comas)
          <input
            value={edicion.sectores.join(',')}
            onChange={(e) => cambiar('sectores', e.target.value.split(','))}
          />
        </label>
        <label className="empresa-campo-ancho">
          Sobre la empresa
          <textarea
            required
            value={edicion.acerca ?? ''}
            onChange={(e) => cambiar('acerca', e.target.value)}
          />
        </label>
      </div>

      <div className="empresa-acciones">
        <button className="empresa-btn" type="submit">Guardar perfil</button>
        <button type="button" className="empresa-btn-secundario" onClick={onCancelar}>Cancelar</button>
      </div>
      <p className="empresa-aviso" role="status">{aviso}</p>
    </form>
  )
}

function PerfilEmpresa() {
  const contexto = useOutletContext()
  // Logo y rol salen directo de la sesión (/auth/me), así se actualizan con refreshUser().
  const miembro = useAuth().user?.company_member
  const [editando, setEditando] = useState(false)

  const empresa = contexto?.empresa ?? {}
  const resumen = contexto?.resumen ?? {}
  const sectores = Array.isArray(empresa.sectores)
    ? empresa.sectores.filter((s) => typeof s === 'string' && s.trim())
    : []

  const estadisticas = [
    [resumen.ofertasPublicadas, 'Ofertas publicadas'],
    [resumen.aplicantes, 'Aplicantes totales'],
    [resumen.aceptados, 'Aceptados'],
  ]
  const contacto = [
    ['Sitio web', empresa.web],
    ['Correo RRHH', empresa.correo],
    ['Teléfono', empresa.telefono],
    ['Tamaño', empresa.tamano],
  ]

  return (
    <section className="perfil empresa-perfil">
      <article className="tarjeta perfil-principal">
        <header>
          {/* Solo el owner puede cambiar el logo: a los reclutadores no se les pasa `api`. */}
          <AvatarEditable
            url={miembro?.company?.logo_url}
            siglas={empresa.siglas}
            api={miembro?.is_owner ? logoApi : undefined}
            etiqueta="logo"
          />
          <h2>{empresa.nombre || 'Perfil sin cargar'}</h2>
          <p>{empresa.descripcion}</p>
          {empresa.ubicacion && <p className="ubicacion"><IconPin />{empresa.ubicacion}</p>}
          {/* Solo el owner edita los datos de la empresa; los reclutadores la ven en solo lectura. */}
          {miembro?.is_owner && (
            <button type="button" className="btn-contorno" onClick={() => setEditando(true)}>Editar perfil</button>
          )}
        </header>
        <ul className="estadisticas">
          {estadisticas.map(([numero, label]) => (
            <li key={label}><strong>{numero ?? '—'}</strong>{label}</li>
          ))}
        </ul>
      </article>

      {editando && miembro?.is_owner && <FormularioPerfilEmpresa empresa={empresa} onCancelar={() => setEditando(false)} />}

      <section className="tarjeta">
        <h3>Sobre la empresa</h3>
        <p>{empresa.acerca || 'Sin descripción.'}</p>
      </section>

      <section className="tarjeta">
        <h3>Sectores</h3>
        {sectores.length === 0 && <p>Sin sectores registrados.</p>}
        <ul className="etiquetas">
          {sectores.map((s, i) => <li key={i}>{s.trim()}</li>)}
        </ul>
      </section>

      <section className="tarjeta">
        <h3>Información de contacto</h3>
        <dl className="perfil-datos">
          {contacto.map(([label, valor]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{valor || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>
    </section>
  )
}

export default PerfilEmpresa
