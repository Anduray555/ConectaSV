import { Campo, CampoSelect } from "./Campo"
import { Edificio, Mundo, Telefono } from "../../assets/icons/landing/Svg_Icons"

// Máscara ####-####: deja solo dígitos (máx. 8) y pone el guion después del 4.º.
function mascaraTelefono(e) {
  let digitos = e.target.value.replace(/\D/g, '')
  if (digitos.length > 8 && digitos.startsWith('503')) digitos = digitos.slice(3) // "+503 2290-1234"
  digitos = digitos.slice(0, 8)
  e.target.value = digitos.length > 4 ? `${digitos.slice(0, 4)}-${digitos.slice(4)}` : digitos
}

function PerfilEmpresa({ sectores, errores }) {
  return (
    <>
      <Campo
        id="perfil_empresa"
        name="company_name"
        label="Nombre de la empresa"
        icono={<Edificio />}
        placeholder="Banco Agrícola S.A."
        autoComplete="organization"
        error={errores.company_name}
      />
      <CampoSelect
        id="perfil_sector"
        name="sector_id"
        label="Sector"
        placeholder="Selecciona el sector"
        opciones={sectores.map((s) => ({ value: s.id, label: s.name }))}
        error={errores.sector_id}
      />
      <Campo
        id="perfil_web"
        name="web_site"
        label="Sitio web (opcional)"
        icono={<Mundo />}
        placeholder="www.empresa.com.sv"
        requerido={false}
        autoComplete="url"
        error={errores.web_site}
      />
      <Campo
        id="perfil_telefono"
        name="contact_number"
        label="Teléfono de contacto"
        icono={<Telefono />}
        type="tel"
        inputMode="numeric"
        placeholder="2290-1234"
        pattern="\d{4}-\d{4}"
        title="Usa el formato ####-####"
        onInput={mascaraTelefono}
        autoComplete="tel"
        error={errores.contact_number}
      />
    </>
  )
}

export default PerfilEmpresa
