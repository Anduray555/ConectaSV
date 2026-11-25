// Los formularios piden "Nombres" y "Apellidos" en un campo cada uno, pero el backend
// los guarda por separado (first_name / second_name, first_surname / second_surname).
// Lo usan el registro (Register.jsx) y la aceptación de invitaciones (AceptarInvitacion.jsx).

// "Andrea Guadalupe" → ["Andrea", "Guadalupe"]; "María de los Ángeles" → ["María", "de los Ángeles"]
export function separar(texto) {
  const [primero, ...resto] = texto.trim().split(/\s+/)
  return [primero ?? '', resto.join(' ') || null]
}

// { nombres: "Ana María", apellidos: "López Pérez", ... } → campos que espera el backend.
export function nombresParaApi({ nombres, apellidos }) {
  const [first_name, second_name] = separar(nombres)
  const [first_surname, second_surname] = separar(apellidos)
  return { first_name, second_name, first_surname, second_surname }
}

// Al revés: los errores del backend (first_name, second_name...) se muestran en el
// campo del formulario que corresponde ("nombres" o "apellidos").
export function erroresDelFormulario(fieldErrors) {
  const { first_name, second_name, first_surname, second_surname, ...resto } = fieldErrors
  return {
    ...resto,
    nombres: first_name ?? second_name,
    apellidos: first_surname ?? second_surname,
  }
}
