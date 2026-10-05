import { Campo, CampoSelect } from "./Campo"
import { Carnet } from "../../assets/icons/landing/Svg_Icons"
import { universidades, carreras } from "../../data/registro"

function PerfilEstudiante() {
  return (
    <>
      <CampoSelect
        id="perfil_universidad"
        label="Universidad"
        placeholder="Selecciona tu universidad"
        opciones={universidades}
      />
      <CampoSelect
        id="perfil_carrera"
        label="Carrera"
        placeholder="Selecciona tu carrera"
        opciones={carreras}
      />
      <Campo
        id="perfil_carne"
        label="Número de carné"
        icono={<Carnet />}
        placeholder="MR-2021-001"
      />
    </>
  )
}

export default PerfilEstudiante