import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconBuscar } from '../../assets/icons/dashboard/Iconos'
import { adminApi } from '../../api/admin'
import { parseApiError } from '../../api/errors'
import { usuarioDesdeApi } from '../../data/dashboard'

// Cada filtro de la interfaz se traduce a los parámetros de GET /api/admin/users.
const FILTROS = [
  { valor: 'todos', texto: 'Todos', params: {} },
  { valor: 'estudiante', texto: 'Estudiantes', params: { role: 'student' } },
  { valor: 'empresa', texto: 'Empresas', params: { role: 'company' } },
  { valor: 'activo', texto: 'Activos', params: { status: 'active' } },
  { valor: 'suspendido', texto: 'Suspendidos', params: { status: 'suspended' } },
]

const POR_PAGINA = 15
const ESPERA_BUSQUEDA = 300 // ms sin escribir antes de consultar al servidor

// Parámetros de GET /api/admin/users para el filtro, la búsqueda y la página actuales.
function armarConsulta(filtro, termino, pagina) {
  return {
    ...FILTROS.find((f) => f.valor === filtro).params,
    ...(termino ? { search: termino } : {}),
    page: pagina,
    per_page: POR_PAGINA,
  }
}

const formatearRegistro = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-SV', { timeZone: 'UTC' }) : '—'

function FilaUsuario({ usuario, ocupado, confirmando, onActivar, onPedirSuspender, onSuspender, onCancelar }) {
  return (
    <tr>
      <td>
        <strong>{usuario.nombre}</strong>
        <small>{usuario.correo}</small>
        {usuario.detalle && <small>{usuario.detalle}</small>}
      </td>
      <td><span className="admin-insignia">{usuario.tipo}</span></td>
      <td><span className={`admin-insignia ${usuario.estado}`}>{usuario.estado}</span></td>
      <td>{formatearRegistro(usuario.registro)}</td>
      <td>
        {confirmando ? (
          <div className="admin-confirmacion">
            <small>Se cerrarán todas sus sesiones.</small>
            <div className="admin-acciones">
              <button type="button" className="admin-btn-neutro" disabled={ocupado} onClick={onCancelar}>Cancelar</button>
              <button type="button" className="admin-btn-peligro" disabled={ocupado} onClick={onSuspender}>Sí, suspender</button>
            </div>
          </div>
        ) : (
          <div className="admin-acciones">
            {usuario.estado === 'suspendido' ? (
              <button type="button" className="admin-btn-exito" disabled={ocupado} onClick={onActivar}>Activar</button>
            ) : (
              <button type="button" className="admin-btn-peligro" disabled={ocupado} onClick={onPedirSuspender}>Suspender</button>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}

function UsuariosAdmin() {
  const { recargarResumen } = useOutletContext()

  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')        // lo que se escribe
  const [termino, setTermino] = useState('')          // lo que se envía (tras la espera)
  const [pagina, setPagina] = useState(1)
  const [recarga, setRecarga] = useState(0)           // súbelo para volver a pedir la misma página
  const [resultado, setResultado] = useState(null)    // { clave, usuarios, total, ultimaPagina, error }
  const [ocupadoId, setOcupadoId] = useState(null)
  const [confirmarId, setConfirmarId] = useState(null)
  const [aviso, setAviso] = useState(null)            // { tipo: 'error' | 'ok', texto }

  // Identifica la consulta actual: si no coincide con la del último resultado, se está cargando.
  const clave = `${JSON.stringify(armarConsulta(filtro, termino, pagina))}#${recarga}`
  const cargando = resultado?.clave !== clave

  // Espera a que el usuario deje de escribir y vuelve a la página 1.
  useEffect(() => {
    const id = setTimeout(() => {
      setTermino(busqueda.trim())
      setPagina(1)
    }, ESPERA_BUSQUEDA)
    return () => clearTimeout(id)
  }, [busqueda])

  // GET /api/admin/users con los filtros actuales. Cancela la consulta anterior si cambian.
  useEffect(() => {
    const control = new AbortController()
    const claveConsulta = `${JSON.stringify(armarConsulta(filtro, termino, pagina))}#${recarga}`

    adminApi
      .users(armarConsulta(filtro, termino, pagina), { signal: control.signal })
      .then((respuesta) => setResultado({
        clave: claveConsulta,
        usuarios: respuesta.data.map(usuarioDesdeApi),
        total: respuesta.meta.total,
        ultimaPagina: respuesta.meta.last_page,
        error: null,
      }))
      .catch((err) => {
        if (control.signal.aborted) return
        setResultado((anterior) => ({ ...anterior, clave: claveConsulta, error: parseApiError(err).message }))
      })

    return () => control.abort()
  }, [filtro, termino, pagina, recarga])

  function cambiarFiltro(valor) {
    setFiltro(valor)
    setPagina(1)
  }

  // PATCH /api/admin/users/{id}/status. Solo cambia la pantalla cuando el servidor confirma.
  async function cambiarEstado(usuario, activo) {
    setOcupadoId(usuario.id)
    setAviso(null)
    try {
      await adminApi.updateStatus(usuario.id, activo)
      setAviso({
        tipo: 'ok',
        texto: activo ? `${usuario.nombre} fue activado.` : `${usuario.nombre} fue suspendido y se cerraron sus sesiones.`,
      })
      setConfirmarId(null)
      setRecarga((n) => n + 1)
      recargarResumen()
    } catch (err) {
      setAviso({ tipo: 'error', texto: parseApiError(err).message })
    } finally {
      setOcupadoId(null)
    }
  }

  const usuarios = resultado?.usuarios ?? []
  const ultimaPagina = resultado?.ultimaPagina ?? 1

  return (
    <section className="admin-usuarios">
      <header className="admin-titulo">
        <h2>Gestión de Usuarios</h2>
        <p>
          {resultado?.total != null
            ? `${resultado.total} ${resultado.total === 1 ? 'usuario' : 'usuarios'}`
            : 'Cargando usuarios…'}
        </p>
      </header>

      <label className="buscador">
        <IconBuscar />
        <input
          aria-label="Buscar usuarios por nombre, correo o empresa"
          type="search"
          placeholder="Buscar por nombre, correo o empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </label>

      <menu className="filtros">
        {FILTROS.map(({ valor, texto }) => (
          <li key={valor}>
            <button
              type="button"
              aria-pressed={filtro === valor}
              className={filtro === valor ? 'activo' : ''}
              onClick={() => cambiarFiltro(valor)}
            >
              {texto}
            </button>
          </li>
        ))}
      </menu>

      {aviso && (
        <p className={aviso.tipo === 'error' ? 'admin-error' : 'admin-aviso'} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          {aviso.texto}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">×</button>
        </p>
      )}

      <div className={`admin-tabla ${cargando && resultado ? 'cargando' : ''}`} aria-busy={cargando}>
        <table>
          <caption className="admin-solo-lector">Usuarios de la plataforma</caption>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <FilaUsuario
                key={u.id}
                usuario={u}
                ocupado={ocupadoId === u.id}
                confirmando={confirmarId === u.id}
                onActivar={() => cambiarEstado(u, true)}
                onPedirSuspender={() => setConfirmarId(u.id)}
                onSuspender={() => cambiarEstado(u, false)}
                onCancelar={() => setConfirmarId(null)}
              />
            ))}
            {!usuarios.length && (
              <tr>
                <td colSpan="5" className="admin-vacio">
                  {resultado?.error
                    ?? (cargando ? 'Cargando usuarios…' : 'No hay usuarios que coincidan con los filtros.')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {usuarios.length > 0 && resultado?.error && (
        <p className="admin-error" role="alert">{resultado.error}</p>
      )}

      {ultimaPagina > 1 && (
        <nav className="admin-paginacion" aria-label="Páginas de usuarios">
          <button type="button" disabled={pagina <= 1 || cargando} onClick={() => setPagina((p) => p - 1)}>
            ← Anterior
          </button>
          <span>Página {pagina} de {ultimaPagina}</span>
          <button type="button" disabled={pagina >= ultimaPagina || cargando} onClick={() => setPagina((p) => p + 1)}>
            Siguiente →
          </button>
        </nav>
      )}
    </section>
  )
}

export default UsuariosAdmin
