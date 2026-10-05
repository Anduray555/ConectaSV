import { useState } from 'react'
import { IconCarta, IconProyecto, IconCalendario } from '../../assets/icons/dashboard/Iconos'
import HojaDocumento from '../../components/dashboard/HojaDocumento'

const documentos = [
  { valor: 'carta', texto: 'Carta de Solicitud', icono: <IconCarta /> },
  { valor: 'proyecto', texto: 'Perfil del Proyecto', icono: <IconProyecto /> },
  { valor: 'plan', texto: 'Plan de Trabajo', icono: <IconCalendario /> },
]

// Cada grupo es una tarjeta; cada campo se dibuja con un .map()
const grupos = [
  {
    titulo: 'Datos del estudiante',
    campos: [
      { name: 'nombre', label: 'Nombre completo' },
      { name: 'carne', label: 'Carné' },
      { name: 'universidad', label: 'Universidad' },
      { name: 'carrera', label: 'Carrera' },
    ],
  },
  {
    titulo: 'Institución receptora',
    campos: [
      { name: 'institucion', label: 'Empresa / Institución' },
      { name: 'direccion', label: 'Dirección' },
      { name: 'tutor', label: 'Tutor Institucional' },
      { name: 'telTutor', label: 'Teléfono del tutor' },
    ],
  },
  {
    titulo: 'Datos del proyecto',
    campos: [
      { name: 'proyecto', label: 'Nombre del proyecto' },
      { name: 'horas', label: 'Horas', type: 'number' },
      { name: 'inicio', label: 'Fecha de inicio', type: 'date' },
      { name: 'fin', label: 'Fecha de finalización', type: 'date' },
    ],
  },
]

const datosIniciales = {
  nombre: 'Andrea Guadalupe Martínez López',
  carne: 'MR-2021-001',
  universidad: 'Universidad de El Salvador',
  carrera: 'Ingeniería en Sistemas Informáticos',
  institucion: 'Cruz Roja Salvadoreña',
  direccion: '75 Av. Norte, San Salvador',
  tutor: 'Licda. Carmen Elena Vásquez',
  telTutor: '7890-1234',
  proyecto: 'Sistema de Gestión Documental para Cruz Roja Salvadoreña',
  horas: '300',
  inicio: '2024-01-14',
  fin: '2024-04-29',
}

function DocumentosSS() {
  const [doc, setDoc] = useState('carta')
  const [datos, setDatos] = useState(datosIniciales)

  // Un solo manejador para todos los inputs: usa el "name" del input como clave
  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  return (
    <section className="docs">
      <form className="docs-form">
        <h2>Documentos para Servicio Social</h2>
        <p>Completa tus datos una vez y genera los tres documentos requeridos automáticamente.</p>

        <menu className="docs-tabs">
          {documentos.map((d) => (
            <li key={d.valor}>
              <button
                type="button"
                className={doc === d.valor ? 'activo' : ''}
                onClick={() => setDoc(d.valor)}
              >
                {d.icono}
                {d.texto}
              </button>
            </li>
          ))}
        </menu>

        {grupos.map((g) => (
          <section key={g.titulo} className="tarjeta">
            <h3>{g.titulo}</h3>
            {g.campos.map((c) => (
              <label key={c.name}>
                {c.label}
                <input
                  type={c.type ?? 'text'}
                  name={c.name}
                  value={datos[c.name]}
                  onChange={cambiar}
                />
              </label>
            ))}
          </section>
        ))}
      </form>

      <aside className="docs-vista">
        <h3>Vista previa</h3>
        <HojaDocumento doc={doc} datos={datos} />
      </aside>
    </section>
  )
}

export default DocumentosSS
