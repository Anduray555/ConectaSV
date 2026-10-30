// Modelos iniciales vacíos. Hidratar desde la API en cada layout.
// null significa dato aún no disponible; no equivale a un total de cero.
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
