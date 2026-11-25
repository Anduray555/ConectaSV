// Los tipos de oferta vienen del backend con su nombre del catálogo (offer_types);
// en la interfaz se muestran con un texto más cercano al estudiante.
// Lo usan el registro (PerfilEstudiante) y Mi Perfil, para que digan lo mismo.
export const ETIQUETA_INTERES = {
  'Trabajo': 'Empleo',
  'Práctica': 'Prácticas',
  'Servicio Social': 'Horas sociales',
}

export const etiquetaInteres = (nombre) => ETIQUETA_INTERES[nombre] ?? nombre
