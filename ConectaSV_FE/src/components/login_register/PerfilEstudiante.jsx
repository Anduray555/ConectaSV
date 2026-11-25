import { useEffect, useState } from "react"
import { Campo, CampoSelect, ErrorCampo } from "./Campo"
import { Carnet } from "../../assets/icons/landing/Svg_Icons"
import { catalogApi } from "../../api/catalogs"
import { etiquetaInteres } from "../../utils/intereses"

const aOpciones = (lista) => lista.map((item) => ({ value: item.id, label: item.name }))


function PerfilEstudiante({ universidades, tiposOferta, errores }) {
  const [universidadId, setUniversidadId] = useState("")
  const [carreraId, setCarreraId] = useState("")
  const [carreras, setCarreras] = useState([])
  const [cargandoCarreras, setCargandoCarreras] = useState(false)
  const [errorCarreras, setErrorCarreras] = useState(null)

  useEffect(() => {
    if (!universidadId) return
    let cancelado = false

    catalogApi
      .careers(universidadId)
      .then((data) => { if (!cancelado) setCarreras(data) })
      .catch(() => { if (!cancelado) setErrorCarreras('No se pudieron cargar las carreras.') })
      .finally(() => { if (!cancelado) setCargandoCarreras(false) })

    return () => { cancelado = true }
  }, [universidadId])

  function handleUniversidad(e) {
    setUniversidadId(e.target.value)
    setCarreraId("")
    setCarreras([])
    setErrorCarreras(null)
    setCargandoCarreras(Boolean(e.target.value))
  }

  const placeholderCarrera = !universidadId
    ? 'Primero elige tu universidad'
    : cargandoCarreras ? 'Cargando carreras…' : 'Selecciona tu carrera'

  return (
    <>
      <CampoSelect
        id="perfil_universidad"
        name="university_id"
        label="Universidad"
        placeholder="Selecciona tu universidad"
        opciones={universidades.map((u) => ({ value: u.id, label: u.short_name ? `${u.short_name} — ${u.name}` : u.name }))}
        value={universidadId}
        onChange={handleUniversidad}
        error={errores.university_id}
      />
      <CampoSelect
        id="perfil_carrera"
        name="career_id"
        label="Carrera"
        placeholder={placeholderCarrera}
        opciones={aOpciones(carreras)}
        value={carreraId}
        onChange={(e) => setCarreraId(e.target.value)}
        disabled={!universidadId || cargandoCarreras}
        error={errores.career_id ?? errorCarreras}
      />
      <Campo
        id="perfil_carne"
        name="student_code"
        label="Número de carné"
        icono={<Carnet />}
        placeholder="MR21001"
        maxLength={10}
        autoComplete="off"
        error={errores.student_code}
      />

      <fieldset className="intereses">
        <legend>¿Qué estás buscando?</legend>
        <p>Elige una o varias opciones. Podrás cambiarlas después.</p>
        <div className="intereses-opciones">
          {tiposOferta.map((tipo) => (
            <label key={tipo.id} className="interes">
              <input type="checkbox" name="interests" value={tipo.id} />
              <span>{etiquetaInteres(tipo.name)}</span>
            </label>
          ))}
        </div>
        <ErrorCampo id="perfil_intereses" error={errores.interests} />
      </fieldset>
    </>
  )
}

export default PerfilEstudiante
