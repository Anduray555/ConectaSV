import { useOutletContext } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { roleLabel } from '../../utils/roleRoutes'
import AvatarEditable from '../../components/perfil/AvatarEditable'
import { avatarApi } from '../../api/images'

// Perfil del administrador. Usa el mismo diseño que los perfiles de estudiante y empresa
// (.perfil / .perfil-principal) para que un cambio estético se aplique a los tres.
// Los datos de la cuenta vienen de useAuth() (GET /api/auth/me); las cifras, del resumen admin.

function PerfilAdmin() {
  const { user } = useAuth()
  const { datos } = useOutletContext() ?? {}
  const resumen = datos?.resumen

  const nombreCompleto = [user?.first_name, user?.second_name, user?.first_surname, user?.second_surname]
    .filter(Boolean)
    .join(' ')
  const nombre = [user?.first_name, user?.first_surname].filter(Boolean).join(' ')
  const siglas = `${user?.first_name?.[0] ?? ''}${user?.first_surname?.[0] ?? ''}`.toUpperCase()

  // TODO BACKEND: métricas agregadas del servidor (mismo resumen que el Panel Admin).
  const estadisticas = [
    [resumen?.usuarios, 'Usuarios'],
    [resumen?.empresas, 'Empresas'],
    [resumen?.tickets, 'Tickets'],
  ]

  const cuenta = [
    ['Nombre completo', nombreCompleto],
    ['Correo electrónico', user?.email],
    ['Rol', user?.role && roleLabel(user.role)],
    ['Estado', user?.is_active == null ? null : user.is_active ? 'Activa' : 'Inactiva'],
  ]

  return (
    <section className="perfil">
      <article className="tarjeta perfil-principal">
        <header>
          <AvatarEditable url={user?.avatar_url} siglas={siglas} api={avatarApi} />
          <h2>{nombre || 'Perfil sin cargar'}</h2>
          <p>{user?.role ? `${roleLabel(user.role)} · ConectaSV` : 'Sin información de la cuenta'}</p>
          {/* TODO BACKEND: endpoint para editar nombre, correo y contraseña del administrador. */}
          <button type="button" className="btn-contorno" disabled>Editar perfil</button>
        </header>

        <ul className="estadisticas">
          {estadisticas.map(([numero, texto]) => (
            <li key={texto}>
              <strong>{numero ?? '—'}</strong>
              {texto}
            </li>
          ))}
        </ul>
      </article>

      <section className="tarjeta">
        <h3>Información de la cuenta</h3>
        <dl className="perfil-datos">
          {cuenta.map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt>{etiqueta}</dt>
              <dd>{valor || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="tarjeta">
        <h3>Permisos</h3>
        <ul className="etiquetas">
          {['Gestión de usuarios', 'Verificación de empresas', 'Soporte'].map((permiso) => (
            <li key={permiso}>{permiso}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default PerfilAdmin
