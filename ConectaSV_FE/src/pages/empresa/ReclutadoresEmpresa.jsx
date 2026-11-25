import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import InvitarReclutadores from '../../components/empresa/InvitarReclutadores'
import { companyMembersApi } from '../../api/members'
import { companyInvitationsApi } from '../../api/invitations'
import { parseApiError } from '../../api/errors'
import { companyRoleLabel } from '../../utils/roleRoutes'

// "Reclutadores": el owner ve a su equipo, las invitaciones pendientes, e invita a más.
// Solo para el owner: el enlace está oculto para los reclutadores y, si escriben la URL,
// los regresamos. La protección real es company.owner en el backend.

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

const iniciales = (nombre) =>
  nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

function ReclutadoresEmpresa() {
  const { user } = useAuth()
  const esOwner = Boolean(user?.company_member?.is_owner)

  const [miembros, setMiembros] = useState(null) // null = cargando
  const [invitaciones, setInvitaciones] = useState(null)
  const [aviso, setAviso] = useState(null) // { tipo: 'ok' | 'error', texto }
  const [ocupadoId, setOcupadoId] = useState(null) // fila con una acción en curso
  const [confirmarId, setConfirmarId] = useState(null) // miembro que se va a desactivar

  const cargarMiembros = useCallback(
    () => companyMembersApi.list().then(setMiembros).catch((err) => setAviso({ tipo: 'error', texto: parseApiError(err).message })),
    [],
  )
  const cargarInvitaciones = useCallback(
    () => companyInvitationsApi.list().then(setInvitaciones).catch((err) => setAviso({ tipo: 'error', texto: parseApiError(err).message })),
    [],
  )

  useEffect(() => {
    if (!esOwner) return
    cargarMiembros()
    cargarInvitaciones()
  }, [esOwner, cargarMiembros, cargarInvitaciones])

  if (!esOwner) return <Navigate to="/empresa/dashboard" replace />

  async function cambiarEstado(miembro, activo) {
    setOcupadoId(miembro.id)
    setAviso(null)
    try {
      const actualizado = await companyMembersApi.updateStatus(miembro.id, activo)
      // Se reemplaza solo esa fila; no hace falta volver a pedir toda la lista.
      setMiembros((lista) => lista.map((m) => (m.id === actualizado.id ? actualizado : m)))
      setAviso({
        tipo: 'ok',
        texto: activo ? `${actualizado.full_name} puede volver a iniciar sesión.` : `${actualizado.full_name} fue desactivado y se cerraron sus sesiones.`,
      })
    } catch (err) {
      setAviso({ tipo: 'error', texto: parseApiError(err).message })
    } finally {
      setOcupadoId(null)
      setConfirmarId(null)
    }
  }

  async function revocar(invitacion) {
    setOcupadoId(`inv-${invitacion.id}`)
    setAviso(null)
    try {
      await companyInvitationsApi.revoke(invitacion.id)
      setInvitaciones((lista) => lista.filter((i) => i.id !== invitacion.id))
    } catch (err) {
      setAviso({ tipo: 'error', texto: parseApiError(err).message })
    } finally {
      setOcupadoId(null)
    }
  }

  return (
    <section className="reclutadores">
      <header className="admin-titulo">
        <h2>Tu equipo</h2>
        <p>Invita reclutadores a {user.company_member.company.name} y gestiona quién tiene acceso.</p>
      </header>

      {aviso && (
        <p className={aviso.tipo === 'error' ? 'admin-error' : 'admin-aviso'} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          {aviso.texto}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">×</button>
        </p>
      )}

      <div className="reclutadores-columnas">
        <div className="reclutadores-principal">
          {/* ---------- Miembros ---------- */}
          <section className="tarjeta">
            <h3>Miembros {miembros && <small>({miembros.length})</small>}</h3>
            <div className="admin-tabla" aria-busy={miembros === null}>
              <table>
                <caption className="admin-solo-lector">Miembros de la empresa</caption>
                <thead>
                  <tr>
                    <th>Persona</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Se unió</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {miembros === null && (
                    <tr><td colSpan="5" className="admin-vacio">Cargando miembros…</td></tr>
                  )}
                  {miembros?.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="reclutadores-persona">
                          {m.avatar_url ? <img src={m.avatar_url} alt="" /> : <b>{iniciales(m.full_name)}</b>}
                          <div>
                            <strong>{m.full_name}</strong>
                            <small>{m.email}</small>
                            {m.phone && <small>{m.phone}</small>}
                          </div>
                        </div>
                      </td>
                      <td><span className="admin-insignia">{companyRoleLabel(m.role)}</span></td>
                      <td>
                        <span className={`admin-insignia ${m.is_active ? 'activo' : 'suspendido'}`}>
                          {m.is_active ? 'Activo' : 'Desactivado'}
                        </span>
                      </td>
                      <td>{fecha(m.joined_at)}</td>
                      <td>
                        {m.is_owner ? (
                          <small>Tú</small>
                        ) : confirmarId === m.id ? (
                          // Confirmación en la misma fila (como en Usuarios del admin), sin ventanas emergentes.
                          <div className="admin-confirmacion">
                            <small>Se cerrarán sus sesiones y no podrá entrar.</small>
                            <div className="admin-acciones">
                              <button type="button" className="admin-btn-neutro" disabled={ocupadoId === m.id} onClick={() => setConfirmarId(null)}>Cancelar</button>
                              <button type="button" className="admin-btn-peligro" disabled={ocupadoId === m.id} onClick={() => cambiarEstado(m, false)}>Sí, desactivar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-acciones">
                            {m.is_active ? (
                              <button type="button" className="admin-btn-peligro" disabled={ocupadoId === m.id} onClick={() => setConfirmarId(m.id)}>Desactivar</button>
                            ) : (
                              <button type="button" className="admin-btn-exito" disabled={ocupadoId === m.id} onClick={() => cambiarEstado(m, true)}>Reactivar</button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------- Invitaciones ---------- */}
          <section className="tarjeta">
            <h3>Invitaciones sin aceptar {invitaciones && <small>({invitaciones.length})</small>}</h3>
            <p className="reclutadores-nota">
              Por seguridad, el link de una invitación solo se muestra al crearla. Si se perdió, revócala y genera otra.
            </p>
            <div className="admin-tabla" aria-busy={invitaciones === null}>
              <table>
                <caption className="admin-solo-lector">Invitaciones sin aceptar</caption>
                <thead>
                  <tr>
                    <th>Para</th>
                    <th>Estado</th>
                    <th>Vence</th>
                    <th>Invitó</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invitaciones === null && (
                    <tr><td colSpan="5" className="admin-vacio">Cargando invitaciones…</td></tr>
                  )}
                  {invitaciones?.length === 0 && (
                    <tr><td colSpan="5" className="admin-vacio">No hay invitaciones pendientes.</td></tr>
                  )}
                  {invitaciones?.map((inv) => (
                    <tr key={inv.id}>
                      <td><strong>{inv.email ?? 'Link sin correo'}</strong></td>
                      <td>
                        <span className={`admin-insignia ${inv.status === 'expired' ? 'suspendido' : 'pendiente'}`}>
                          {inv.status === 'expired' ? 'Vencida' : 'Pendiente'}
                        </span>
                      </td>
                      <td>{fecha(inv.expires_at)}</td>
                      <td>{inv.invited_by?.first_name ?? '—'}</td>
                      <td>
                        <div className="admin-acciones">
                          <button type="button" className="admin-btn-peligro" disabled={ocupadoId === `inv-${inv.id}`} onClick={() => revocar(inv)}>
                            {inv.status === 'expired' ? 'Eliminar' : 'Revocar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ---------- Invitar (el mismo componente de "Invita a tu equipo") ---------- */}
        <aside className="tarjeta reclutadores-invitar">
          <h3>Invitar reclutadores</h3>
          <InvitarReclutadores onCreada={cargarInvitaciones} />
        </aside>
      </div>
    </section>
  )
}

export default ReclutadoresEmpresa
