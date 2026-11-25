import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AvatarEditable from '../../components/perfil/AvatarEditable'
import { avatarApi } from '../../api/images'
import { companyRoleLabel } from '../../utils/roleRoutes'

// Perfil de la PERSONA que trabaja en la empresa (owner o reclutador).
// Lo de la empresa (logo, sectores, contacto) vive en PerfilEmpresa (/empresa/perfil).
// Usa el mismo diseño que los demás perfiles (.perfil / .perfil-principal).
// Todos los datos vienen de useAuth() (GET /api/auth/me).

function MiPerfilEmpresa() {
  const { user } = useAuth()
  const miembro = user?.company_member
  const empresa = miembro?.company

  const nombreCompleto = [user?.first_name, user?.second_name, user?.first_surname, user?.second_surname]
    .filter(Boolean)
    .join(' ')
  const nombre = [user?.first_name, user?.first_surname].filter(Boolean).join(' ')
  const siglas = `${user?.first_name?.[0] ?? ''}${user?.first_surname?.[0] ?? ''}`.toUpperCase()
  const rol = miembro ? companyRoleLabel(miembro.role) : null

  // TODO BACKEND: cifras propias del miembro (ofertas que creó, candidatos, conversaciones).
  const estadisticas = [
    [null, 'Ofertas creadas'],
    [null, 'Candidatos'],
    [null, 'Conversaciones'],
  ]

  const cuenta = [
    ['Nombre completo', nombreCompleto],
    ['Correo electrónico', user?.email],
    ['Teléfono', miembro?.phone],
    ['Rol en la empresa', rol],
  ]

  return (
    <section className="perfil">
      <article className="tarjeta perfil-principal">
        <header>
          {/* Cada miembro, owner o reclutador, puede cambiar SU foto. */}
          <AvatarEditable url={user?.avatar_url} siglas={siglas} api={avatarApi} />
          <h2>{nombre || 'Perfil sin cargar'}</h2>
          <p>{[rol, empresa?.name].filter(Boolean).join(' · ') || 'Sin información de la cuenta'}</p>
          {/* TODO BACKEND: endpoint para editar nombre y teléfono del miembro. */}
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
        <h3>Empresa</h3>
        <dl className="perfil-datos">
          <div>
            <dt>Nombre</dt>
            <dd>{empresa?.name || '—'}</dd>
          </div>
          <div>
            <dt>Sector</dt>
            <dd>{empresa?.sector || '—'}</dd>
          </div>
        </dl>
        <p className="perfil-enlace">
          <Link to="/empresa/perfil">Ver perfil de la empresa →</Link>
        </p>
      </section>
    </section>
  )
}

export default MiPerfilEmpresa
