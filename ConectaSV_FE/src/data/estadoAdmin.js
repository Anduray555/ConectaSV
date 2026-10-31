// Valores vacíos: null significa que el backend todavía no ha proporcionado datos.
export function crearEstadoAdmin() {
  return {
    sesion: null,
    sistema: null,
    resumen: null,
    tickets: [],
    usuarios: [],
    pendientes: [],
    cargado: false,
  }
}

// TODO BACKEND: implementar consultas autenticadas y adaptar las respuestas al estado
// anterior. Mantener separados los totales globales y las páginas de usuarios/tickets.
// Modelos de vista esperados:
// sesion: { nombre, correo, siglas, rol }; sistema: { activo }.
// resumen: { usuarios, estudiantes, empresas, tickets, universidades,
//            empresasPendientes, ticketsAltaPrioridad, ticketsSinLeer }.
// usuario: { id, nombre, correo, tipo: 'estudiante'|'empresa',
//            estado: 'activo'|'suspendido'|'pendiente', registro, detalle, motivoRevision }.
// ticket: { id, nombre, tipo, asunto, prioridad: 'alta'|'media'|'baja',
//           estado: 'abierto'|'proceso'|'resuelto', fecha,
//           mensajes: [{ id, autor, deAdmin, texto, fecha }] }.
// Las fechas deben ser ISO; los IDs y el orden de mensajes deben venir del servidor.

export async function ejecutarAccionAdmin() {
  // TODO BACKEND: sustituir por un servicio que reciba operación, id y payload.
  // Soportar responderTicket, cambiarEstadoTicket, cambiarEstadoUsuario,
  // aprobarUsuario y rechazarUsuario. Validar permisos en CADA endpoint,
  // registrar auditoría y devolver la entidad actualizada antes de modificar la UI.
  throw new Error('El servicio de administración todavía no está conectado.')
}
