// TODO BACKEND: cargar únicamente ofertas, candidatos y expedientes de la empresa autenticada.
// Estos datos son de demostración; los cambios se conservan solo mientras el layout está montado.
// TODO BACKEND: sustituir por el perfil autenticado (incluyendo logo/siglas), plan y verificación.
export const empresaMock = {
  nombre: 'Banco Agrícola', siglas: 'BA', descripcion: 'Institución financiera líder en El Salvador',
  ubicacion: 'San Salvador, El Salvador',
  acerca: 'Somos una institución financiera comprometida con el desarrollo de El Salvador. Nuestro equipo digital trabaja con las últimas tecnologías para brindar una mejor experiencia a las personas y empresas que confían en nosotros.',
  sectores: ['Banca', 'Tecnología', 'Finanzas', 'Seguros'],
  web: 'www.bancoagricola.com', correo: 'rrhh@bancoagricola.com', telefono: '2230-1000', tamano: '1,000+ empleados',
}
// TODO BACKEND: sustituir por ofertas propias con ids reales, fecha de publicación, estado,
// descripción, salario estructurado y totales de aplicantes; adaptar el formato para la UI.
export const ofertasEmpresaMock = [
  { id: 'frontend', titulo: 'Desarrollador Frontend Junior', ubicacion: 'San Salvador', salario: '$800 – $1,200/mes', tipo: 'Empleo', etiquetas: ['React', 'TypeScript', 'Remoto'], publicado: 'Hace 2 días', activa: true },
  { id: 'marketing', titulo: 'Practicante de Marketing Digital', ubicacion: 'Santa Tecla', salario: '$300/mes', tipo: 'Práctica', etiquetas: ['Marketing', 'Redes Sociales', 'Presencial'], publicado: 'Hace 1 día', activa: true },
  { id: 'social', titulo: 'Horas Sociales — Apoyo Administrativo', ubicacion: 'San Salvador', salario: '', tipo: 'Servicio Social', etiquetas: ['Servicio Social', 'Administración', 'ONG'], publicado: 'Hace 3 días', activa: true },
  { id: 'redes', titulo: 'Practicante de Ingeniería de Redes', ubicacion: 'San Salvador', salario: '$350/mes', tipo: 'Práctica', etiquetas: ['Redes', 'Cisco', 'Telecomunicaciones'], publicado: 'Hace 5 días', activa: false },
  { id: 'salud', titulo: 'Horas Sociales — Informática y Salud', ubicacion: 'Soyapango', salario: '', tipo: 'Servicio Social', etiquetas: ['Servicio Social', 'Salud Pública', 'IT'], publicado: 'Hace 1 semana', activa: true },
  { id: 'soporte', titulo: 'Soporte técnico', ubicacion: 'San Salvador', salario: '$450/mes', tipo: 'Empleo', etiquetas: ['Soporte', 'Windows', 'Presencial'], publicado: 'Hace 1 semana', activa: false },
]
// TODO BACKEND: sustituir por postulaciones reales y su relación oferta/candidato;
// estado y compatibilidad son ficticios y deberán provenir de la API.
export const candidatosEmpresaMock = [
  { id: 'andrea', nombre: 'Andrea Martínez', siglas: 'AM', carrera: 'Ing. Sistemas Informáticos', universidad: 'UES', ofertaId: 'frontend', estado: 'Entrevista', match: 92, habilidades: ['React', 'TypeScript', 'Node.js'] },
  { id: 'carlos', nombre: 'Carlos Hernández', siglas: 'CH', carrera: 'Ing. en Computación', universidad: 'UCA', ofertaId: 'frontend', estado: 'Pendiente', match: 87, habilidades: ['Vue.js', 'JavaScript', 'CSS'] },
  { id: 'gabriela', nombre: 'Gabriela Ramos', siglas: 'GR', carrera: 'Lic. Informática Aplicada', universidad: 'UTEC', ofertaId: 'frontend', estado: 'Aceptado', match: 84, habilidades: ['React', 'Python', 'Git'] },
  { id: 'diego', nombre: 'Diego Fuentes', siglas: 'DF', carrera: 'Ing. Sistemas Informáticos', universidad: 'UES', ofertaId: 'frontend', estado: 'Pendiente', match: 79, habilidades: ['Angular', 'Java', 'MySQL'] },
  { id: 'valeria', nombre: 'Valeria López', siglas: 'VL', carrera: 'Ing. en Computación', universidad: 'UFG', ofertaId: 'marketing', estado: 'Rechazado', match: 75, habilidades: ['HTML', 'CSS', 'Bootstrap'] },
  { id: 'jose', nombre: 'José Mejía', siglas: 'JM', carrera: 'Ing. Sistemas Informáticos', universidad: 'UDB', ofertaId: 'redes', estado: 'Pendiente', match: 72, habilidades: ['Redes', 'Cisco', 'Linux'] },
]
// TODO BACKEND: acordar el mapeo de estos ids de UI a los tipos de documento de la API.
// Los tres tipos obligatorios siguen siendo configuración de la interfaz, no registros ficticios.
export const tiposDocumento = [
  { id: 'carta', titulo: 'Carta de solicitud' },
  { id: 'proyecto', titulo: 'Perfil del proyecto' },
  { id: 'plan', titulo: 'Plan de trabajo' },
]
// TODO BACKEND: sustituir por expedientes autorizados con estudiante/proyecto, ids de documento,
// estado de procesamiento, nombre/tamaño, fecha y acceso al PDF persistido.
export const expedientesEmpresaMock = [
  { estudianteId: 'andrea', proyecto: 'Digitalización de procesos administrativos', documentos: { carta: { fuente: 'ConectaSV', fecha: '22 ago 2024' }, proyecto: { fuente: 'Documento de empresa', fecha: '22 ago 2024' }, plan: { fuente: 'ConectaSV', fecha: '23 ago 2024' } } },
  { estudianteId: 'gabriela', proyecto: 'Apoyo a la gestión documental', documentos: { carta: { fuente: 'ConectaSV', fecha: '22 ago 2024' }, proyecto: { fuente: 'Documento de empresa', fecha: '22 ago 2024' } } },
  { estudianteId: 'carlos', proyecto: 'Organización de archivos administrativos', documentos: { carta: { fuente: 'ConectaSV', fecha: '23 ago 2024' } } },
]
// TODO BACKEND: sustituir por conversaciones reales, participantes, remitentes, fechas,
// mensajes paginados, lecturas y presencia; «empresa» representa aquí el nombre del candidato.
export const conversacionesEmpresaMock = [
  { id: 'andrea', empresa: 'Andrea Martínez', siglas: 'AM', color: '#1b3a6b', vacante: 'Candidata — Desarrollador Frontend Junior', hora: '10:32 AM', sinLeer: 1, enLinea: true, mensajes: [
    { id: 1, de: 'yo', texto: 'Hola Andrea, hemos revisado tu perfil y nos parece muy interesante.', hora: 'ayer, 4:15 PM' },
    { id: 2, de: 'empresa', texto: '¡Muchas gracias! Estoy muy emocionada con la oportunidad.', hora: 'ayer, 4:45 PM' },
    { id: 3, de: 'yo', texto: '¿Tienes disponibilidad esta semana para una entrevista técnica?', hora: 'ayer, 5:00 PM' },
    { id: 4, de: 'empresa', texto: 'Claro, el lunes o miércoles en la mañana.', hora: 'ayer, 5:10 PM' },
    { id: 5, de: 'yo', texto: '¡Perfecto! Te esperamos el lunes a las 9am.', hora: '10:32 AM' },
  ] },
  { id: 'gabriela', empresa: 'Gabriela Ramos', siglas: 'GR', color: '#2f7a57', vacante: 'Candidata — Desarrollador Frontend Junior', hora: 'ayer', sinLeer: 0, enLinea: false, mensajes: [{ id: 1, de: 'empresa', texto: 'Confirmado, nos vemos el jueves.', hora: 'ayer' }] },
]
