import { useState } from "react"
import { Candado, Ojo } from "../../assets/icons/landing/Svg_Icons"

export function Campo({ id, label, icono, type = "text", placeholder, requerido = true }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="campo">
        {icono}
        <input type={type} id={id} name={id} placeholder={placeholder} required={requerido} />
      </div>
    </>
  )
}

export function CampoPassword({ id, label, placeholder }) {
  const [mostrar, setMostrar] = useState(false)

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="campo">
        <Candado />
        <input
          type={mostrar ? "text" : "password"}
          id={id}
          name={id}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className="ojo"
          onClick={() => setMostrar(!mostrar)}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <Ojo />
        </button>
      </div>
    </>
  )
}

export function CampoSelect({ id, label, placeholder, opciones }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="campo">
        <select id={id} name={id} defaultValue="" required>
          <option value="" disabled hidden>{placeholder}</option>
          {opciones.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>
    </>
  )
}