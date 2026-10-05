import { useState } from 'react'
import TarjetaOferta from '../../components/dashboard/TarjetaOferta'
import { IconBuscar } from '../../assets/icons/dashboard/Iconos'
import { ofertas } from '../../data/dashboard'

const filtros = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'empleo', texto: 'Empleos' },
  { valor: 'practica', texto: 'Prácticas' },
  { valor: 'servicio', texto: 'Servicio Social' },
]

function Explorar() {
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  // La lista visible se CALCULA a partir del estado; no se guarda aparte
  const visibles = ofertas.filter((o) => {
    const coincideTipo = filtro === 'todas' || o.tipo === filtro
    const textoOferta = [o.titulo, o.empresa, ...o.etiquetas].join(' ').toLowerCase()
    return coincideTipo && textoOferta.includes(busqueda.toLowerCase())
  })

  return (
    <section className="explorar">
      <label className="buscador">
        <IconBuscar />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar roles, empresas, habilidades..."
        />
      </label>

      <menu className="filtros">
        {filtros.map((f) => (
          <li key={f.valor}>
            <button
              type="button"
              className={filtro === f.valor ? 'activo' : ''}
              onClick={() => setFiltro(f.valor)}
            >
              {f.texto}
            </button>
          </li>
        ))}
      </menu>

      {visibles.map((o) => (
        <TarjetaOferta key={o.id} {...o} />
      ))}

      {visibles.length === 0 && (
        <p className="vacio">No hay ofertas que coincidan con tu búsqueda.</p>
      )}
    </section>
  )
}

export default Explorar
