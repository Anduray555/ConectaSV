import { useState } from "react"
import { Candado, Ojo } from "../../assets/icons/landing/Svg_Icons"

// Mensaje de error de validación debajo de un campo.
export function ErrorCampo({ id, error }) {
  if (!error) return null
  return <small id={`${id}_error`} className="campo-error">{error}</small>
}

export function Campo({
  id, label, name, icono, type = "text", placeholder, requerido = true,
  autoComplete, error, maxLength, inputMode, pattern, title, onInput,
  defaultValue, readOnly,
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className={`campo ${error ? 'invalido' : ''}`}>
        {icono}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={requerido}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          title={title}
          onInput={onInput}
          defaultValue={defaultValue}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}_error` : undefined}
        />
      </div>
      <ErrorCampo id={id} error={error} />
    </>
  )
}

export function CampoPassword({ id, name, label, placeholder, error, autoComplete = "current-password" }) {
  const [mostrar, setMostrar] = useState(false)

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className={`campo ${error ? 'invalido' : ''}`}>
        <Candado />
        <input
          type={mostrar ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          required
          minLength="8"
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}_error` : undefined}
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
      <ErrorCampo id={id} error={error} />
    </>
  )
}

// opciones: [{ value, label }]. Con `value` + `onChange` es controlado; sin ellos, no.
export function CampoSelect({ id, name, label, placeholder, opciones, value, onChange, disabled, error }) {
  const controlado = value !== undefined

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className={`campo ${error ? 'invalido' : ''}`}>
        <select
          id={id}
          name={name}
          required
          disabled={disabled}
          {...(controlado ? { value, onChange } : { defaultValue: "" })}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}_error` : undefined}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {opciones.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>
      <ErrorCampo id={id} error={error} />
    </>
  )
}
