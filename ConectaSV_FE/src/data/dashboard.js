// Datos del dashboard (los tres roles): catálogos de la interfaz y estados iniciales vacíos.
// null significa dato aún no disponible; no equivale a un total de cero.

// ── Catálogos de etiquetas de la interfaz; no son registros de ejemplo ──
export const tiposOferta = {
  empleo: 'Empleo',
  practica: 'Práctica',
  servicio: 'Servicio Social',
}

// Los archivos y sus metadatos provienen de la API.
export const tiposDocumento = [
  { id: 'carta', titulo: 'Carta de solicitud' },
  { id: 'proyecto', titulo: 'Perfil del proyecto' },
  { id: 'plan', titulo: 'Plan de trabajo' },
]

// ── Estados iniciales: hidratar desde la API en DashboardLayout ──
export function crearEstadoEstudiante() {
  return {
    perfil: { siglas: '', nombre: '', carrera: '', universidad: '', ubicacion: '', acerca: '', habilidades: [], estadisticas: [{ numero: null, texto: 'Aplicaciones' }, { numero: null, texto: 'Entrevistas' }, { numero: null, texto: 'Mensajes' }] },
    sesion: { rol: null, ciclo: null, activa: null },
    ofertas: [], conversaciones: [], expediente: null,
  }
}
export function crearEstadoEmpresa() {
  return {
    empresa: { nombre: '', siglas: '', descripcion: '', ubicacion: '', acerca: '', sectores: [], web: '', correo: '', telefono: '', tamano: '', verificada: null, plan: null },
    ofertas: [], candidatos: [], expedientes: [], conversaciones: [],
    resumen: { ofertasActivas: null, aplicantes: null, entrevistas: null, sinLeer: null, ofertasPublicadas: null, aceptados: null },
  }
}

// Admin
// resumen: null hasta que responde GET /api/admin/summary (ver resumenDesdeApi).
// recientes: últimos usuarios registrados, con el formato de usuarioDesdeApi.
// La lista completa de usuarios no vive aquí: la pide UsuariosAdmin, paginada y filtrada.
export function crearEstadoAdmin() {
  return {
    resumen: null,
    recientes: [],
    tickets: [],
    cargado: false,
  }
}

// GET /api/admin/summary → totales que usan PanelAdmin y PerfilAdmin.
// Los tickets de soporte todavía no existen en el backend: quedan en null.
export function resumenDesdeApi(data) {
  return {
    usuarios: data.users,
    estudiantes: data.active_students,
    universidades: data.universities,
    empresas: data.companies,
    suspendidos: data.suspended,
    tickets: null,
    ticketsAltaPrioridad: null,
    ticketsSinLeer: null,
  }
}

// Un usuario de /api/admin/users (AdminUserResource) adaptado a las pantallas del admin.
export function usuarioDesdeApi(u) {
  return {
    id: u.id,
    nombre: u.full_name,
    correo: u.email,
    tipo: u.role === 'company' ? 'empresa' : 'estudiante',
    estado: u.is_active ? 'activo' : 'suspendido',
    detalle: u.detail ?? '',
    registro: u.created_at,
  }
}

// ticket: { id, nombre, tipo, asunto, prioridad: 'alta'|'media'|'baja',
//           estado: 'abierto'|'proceso'|'resuelto', fecha,
//           mensajes: [{ id, autor, deAdmin, texto, fecha }] }.
export async function ejecutarAccionAdmin() {
  // TODO BACKEND: soporte (responderTicket, cambiarEstadoTicket) cuando exista la tabla de tickets.
  // La gestión de usuarios ya no pasa por aquí: usa adminApi.updateStatus (api/admin.js).
  throw new Error('El servicio de soporte todavía no está conectado.')
}

// ── Datos de la sesión (GET /api/auth/me → UserResource) adaptados a las vistas ──
// Los campos que el backend aún no guarda (ubicación, descripción, tamaño...) quedan vacíos.
const siglasDe = (...partes) =>
  partes.filter(Boolean).map((p) => p.trim()[0]).join('').slice(0, 2).toUpperCase()

export function perfilEstudianteDesdeUsuario(user) {
  const perfil = user?.student_profile
  return {
    siglas: siglasDe(user?.first_name, user?.first_surname),
    nombre: [user?.first_name, user?.first_surname].filter(Boolean).join(' '),
    carrera: perfil?.career?.name ?? '',
    universidad: perfil?.university?.name ?? '',
    habilidades: (perfil?.interests ?? []).map((i) => i.name),
  }
}

export function empresaDesdeUsuario(user) {
  const empresa = user?.company_member?.company
  if (!empresa) return {}
  return {
    nombre: empresa.name ?? '',
    siglas: siglasDe(...(empresa.name ?? '').split(/\s+/)),
    sectores: empresa.sector ? [empresa.sector] : [],
    web: empresa.web_site ?? '',
    correo: user.email ?? '',
    telefono: empresa.contact_number ?? '',
  }
}
