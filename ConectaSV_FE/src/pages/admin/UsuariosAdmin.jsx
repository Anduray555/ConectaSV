import { useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { IconBuscar } from '../../assets/icons/dashboard/Iconos'

const filtros = [['todos', 'Todos'], ['estudiante', 'Estudiantes'], ['empresa', 'Empresas'], ['activo', 'Activos'], ['suspendido', 'Suspendidos'], ['pendiente', 'Pendientes']]
export default function UsuariosAdmin() {
  const { datos, accion, ocupado } = useOutletContext()
  const [params] = useSearchParams()
  const [filtro, setFiltro] = useState(params.get('estado') === 'pendiente' ? 'pendiente' : 'todos')
  const [busqueda, setBusqueda] = useState('')
  // TODO BACKEND: enviar búsqueda y filtros al servidor con debounce y paginación;
  // devolver total filtrado. Este filtro local solo procesa las entidades cargadas.
  const visibles = datos.usuarios.filter((u) => (filtro === 'todos' || u.tipo === filtro || u.estado === filtro) && `${u.nombre} ${u.correo}`.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase().trim()))
  return (
    <section className="admin-usuarios">
      <header className="admin-titulo"><h2>Gestión de Usuarios</h2><p>{datos.resumen?.usuarios != null ? `${datos.resumen.usuarios} usuarios` : 'Usuarios sin cargar'}</p></header>
      <label className="buscador"><IconBuscar /><input aria-label="Buscar usuarios por nombre o correo" type="search" placeholder="Buscar por nombre o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label>
      <menu className="filtros">{filtros.map(([valor, texto]) => <li key={valor}><button type="button" aria-pressed={filtro === valor} className={filtro === valor ? 'activo' : ''} onClick={() => setFiltro(valor)}>{texto}</button></li>)}</menu>
      <div className="admin-tabla"><table><caption className="admin-solo-lector">Usuarios de la plataforma</caption><thead><tr><th>Usuario</th><th>Tipo</th><th>Estado</th><th>Registro</th><th>Acciones</th></tr></thead><tbody>
        {visibles.map((u) => <tr key={u.id}><td><strong>{u.nombre}</strong><small>{u.correo}</small></td><td><span className="admin-insignia">{u.tipo}</span></td><td><span className={`admin-insignia ${u.estado}`}>{u.estado}</span></td><td>{u.registro ? new Date(u.registro).toLocaleDateString('es-SV', { timeZone: 'UTC' }) : '—'}</td><td><div className="admin-acciones">
          {/* TODO BACKEND: persistir el estado, auditar y refrescar la fila solo tras éxito.
              Confirmar suspensiones e impedir suspender al último admin o a la sesión actual. */}
          {u.estado !== 'activo' && <button disabled={ocupado} onClick={() => accion('cambiarEstadoUsuario', u.id, { estado: 'activo' })}>Activar</button>}
          {u.estado !== 'suspendido' && <button disabled={ocupado} onClick={() => accion('cambiarEstadoUsuario', u.id, { estado: 'suspendido' })}>Suspender</button>}
        </div></td></tr>)}
        {!visibles.length && <tr><td colSpan="5" className="admin-vacio">{datos.cargado ? 'No hay usuarios que coincidan con los filtros.' : 'Los usuarios se mostrarán cuando se conecte el servicio.'}</td></tr>}
      </tbody></table></div>
    </section>
  )
}
