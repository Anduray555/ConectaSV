// MOCK: todos los registros ficticios del Dashboard. Reemplazar al integrar la API.
export const ofertasMock = [
  { id: 1, titulo: 'Desarrollador Frontend Junior', empresa: 'Banco Agrícola', siglas: 'BA', color: '#1b3a6b', ubicacion: 'San Salvador', salario: '$800 – $1,200/mes', tipo: 'empleo', etiquetas: ['React', 'TypeScript', 'Remoto'], publicado: 'Hace 2 días', aplicantes: 34 },
  { id: 2, titulo: 'Practicante de Marketing Digital', empresa: 'Grupo Roble', siglas: 'GR', color: '#2f7a57', ubicacion: 'Santa Tecla', salario: '$300/mes', tipo: 'practica', etiquetas: ['Marketing', 'Redes Sociales', 'Presencial'], publicado: 'Hace 1 día', aplicantes: 58 },
  { id: 3, titulo: 'Horas Sociales — Apoyo Administrativo', empresa: 'Cruz Roja Salvadoreña', siglas: 'CR', color: '#d92d2d', ubicacion: 'San Salvador', salario: null, tipo: 'servicio', etiquetas: ['Servicio Social', 'Administración', 'ONG'], publicado: 'Hace 3 días', aplicantes: 12 },
  { id: 4, titulo: 'Practicante de Ingeniería de Redes', empresa: 'Telecom SV', siglas: 'TS', color: '#c0392b', ubicacion: 'San Salvador', salario: '$350/mes', tipo: 'practica', etiquetas: ['Redes', 'Cisco', 'Presencial'], publicado: 'Hace 4 días', aplicantes: 21 },
]

export const conversacionesMock = [
  {
    id: 1, empresa: 'Banco Agrícola', siglas: 'BA', color: '#1b3a6b', vacante: 'Desarrollador Frontend Junior', hora: '10:32 AM', sinLeer: 2, enLinea: true,
    mensajes: [
      { id: 1, de: 'empresa', texto: 'Hola Andrea, hemos revisado tu perfil y nos parece muy interesante.', hora: 'ayer, 4:15 PM' },
      { id: 2, de: 'yo', texto: '¡Muchas gracias! Estoy muy emocionada con la oportunidad.', hora: 'ayer, 4:45 PM' },
      { id: 3, de: 'empresa', texto: '¿Tienes disponibilidad esta semana para una entrevista técnica?', hora: 'ayer, 5:00 PM' },
      { id: 4, de: 'yo', texto: 'Claro, el lunes o miércoles en la mañana.', hora: 'ayer, 5:10 PM' },
      { id: 5, de: 'empresa', texto: '¡Perfecto! Te esperamos el lunes a las 9am.', hora: '10:32 AM' },
    ],
  },
  {
    id: 2, empresa: 'Grupo Roble', siglas: 'GR', color: '#2f7a57', vacante: 'Practicante de Marketing Digital', hora: 'ayer', sinLeer: 0, enLinea: false,
    mensajes: [{ id: 1, de: 'empresa', texto: 'Por favor envíanos tu portafolio.', hora: 'ayer' }],
  },
]

export const perfilMock = {
  siglas: 'AM', nombre: 'Andrea Martínez', carrera: 'Ing. Sistemas', universidad: 'UES', ubicacion: 'San Salvador, El Salvador',
  acerca: 'Estudiante de 8° ciclo de Ingeniería en Sistemas Informáticos en la UES. Apasionada por el desarrollo web full-stack, con experiencia en proyectos universitarios usando React, Node.js y bases de datos relacionales.',
  habilidades: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Figma', 'Git', 'Python', 'REST APIs'],
  estadisticas: [{ numero: 12, texto: 'Aplicaciones' }, { numero: 3, texto: 'Entrevistas' }, { numero: 2, texto: 'Mensajes' }],
}

export const documentosSSMock = {
  nombre: 'Andrea Guadalupe Martínez López', carne: 'MR-2021-001', universidad: 'Universidad de El Salvador', carrera: 'Ingeniería en Sistemas Informáticos',
  institucion: 'Cruz Roja Salvadoreña', direccion: '75 Av. Norte, San Salvador', tutor: 'Licda. Carmen Elena Vásquez', telTutor: '7890-1234',
  proyecto: 'Sistema de Gestión Documental para Cruz Roja Salvadoreña', horas: '300', inicio: '2024-01-14', fin: '2024-04-29',
}

export const sesionDashboardMock = { rol: 'Estudiante', ciclo: '02-2024' }
