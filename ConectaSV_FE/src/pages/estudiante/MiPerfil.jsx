import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { IconPin } from '../../assets/icons/dashboard/Iconos'
import { catalogApi } from '../../api/catalogs'
import { etiquetaInteres } from '../../utils/intereses'
import AvatarEditable from '../../components/perfil/AvatarEditable'
import { avatarApi } from '../../api/images'
import useAuth from '../../hooks/useAuth'

// El perfil viene de GET /api/auth/me (ver perfilEstudianteDesdeUsuario en data/dashboard.js).

function MiPerfil() {
  const { perfil } = useOutletContext()
  // La foto se lee directo de la sesión: tras subirla, refreshUser() la actualiza aquí.
  const { user } = useAuth()
  // Catálogo completo de tipos de oferta, para mostrar los 3 con "Me interesa" / "No me interesa".
  const [tiposOferta, setTiposOferta] = useState([])

  useEffect(() => {
    catalogApi.offerTypes().then(setTiposOferta).catch(() => setTiposOferta([]))
  }, [])
  const academico = [perfil.carrera, perfil.universidad].filter(Boolean).join(' · ')

  return (
    <section className="perfil">
      <article className="tarjeta perfil-principal">
        <header>
          <AvatarEditable url={user?.avatar_url} siglas={perfil.siglas} api={avatarApi} />

          <h2>{perfil.nombre || 'Perfil sin cargar'}</h2>
          <p>{academico || 'Sin información académica'}</p>
          {perfil.ubicacion && (
            <p className="ubicacion">
              <IconPin /> {perfil.ubicacion}
            </p>
          )}
          <button type="button" className="btn-contorno" disabled>Editar perfil</button>
        </header>

        <ul className="estadisticas">
          {perfil.estadisticas.map((e) => (
            <li key={e.texto}>
              <strong>{e.numero ?? '—'}</strong>
              {e.texto}
            </li>
          ))}
        </ul>
      </article>

      <section className="tarjeta">
        <h3>Sobre mí</h3>
        <p>{perfil.acerca || 'Sin descripción.'}</p>
      </section>

      {/* Mismo formato que "Información de la cuenta" en PerfilAdmin (.perfil-datos). */}
      <section className="tarjeta">
        <h3>Intereses</h3>
        {tiposOferta.length === 0 ? (
          <p>Cargando intereses…</p>
        ) : (
          <dl className="perfil-datos">
            {tiposOferta.map((tipo) => (
              <div key={tipo.id}>
                <dt>{etiquetaInteres(tipo.name)}</dt>
                <dd>{perfil.intereses.includes(tipo.id) ? 'Me interesa' : 'No me interesa'}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="tarjeta">
        <h3>Habilidades</h3>
        {perfil.habilidades.length === 0 && <p>Sin habilidades registradas.</p>}
        <ul className="etiquetas">
          {perfil.habilidades.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default MiPerfil
