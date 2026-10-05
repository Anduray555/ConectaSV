import { Campo, CampoSelect } from "./Campo"
import { Edificio, Mundo, Telefono } from "../../assets/icons/landing/Svg_Icons"
import { sectores } from "../../data/registro"

function PerfilEmpresa() {
  return (
    <>
      <Campo
        id="perfil_empresa"
        label="Nombre de la empresa"
        icono={<Edificio />}
        placeholder="Banco Agrícola S.A."
      />
      <CampoSelect
        id="perfil_sector"
        label="Sector"
        placeholder="Selecciona el sector"
        opciones={sectores}
      />
      <Campo
        id="perfil_web"
        label="Sitio web (opcional)"
        icono={<Mundo />}
        placeholder="www.empresa.com.sv"
        requerido={false}
      />
      <Campo
        id="perfil_telefono"
        label="Teléfono de contacto"
        icono={<Telefono />}
        type="tel"
        placeholder="2290-1234"
      />
    </>
  )
}

export default PerfilEmpresa