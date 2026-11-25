import api from './client'

// Las imágenes viajan como multipart/form-data (no como JSON): por eso se usa FormData.
// Al recibir un FormData, axios pone solo el Content-Type correcto (con su "boundary").
const comoFormulario = (file) => {
  const datos = new FormData()
  datos.append('image', file) // el backend espera el campo "image"
  return datos
}

// Foto de perfil del usuario autenticado (cualquier rol).
export const avatarApi = {
  upload: (file) => api.post('/me/avatar', comoFormulario(file)).then((r) => r.data), // { avatar_url }
  remove: () => api.delete('/me/avatar').then((r) => r.data),
}

// Logo de la empresa (solo owner; el backend responde 403 a los reclutadores).
export const logoApi = {
  upload: (file) => api.post('/company/logo', comoFormulario(file)).then((r) => r.data), // { logo_url }
  remove: () => api.delete('/company/logo').then((r) => r.data),
}

// Mismas reglas que UploadImageRequest en el backend. Revisarlas antes de subir evita
// esperar la subida completa de un archivo que igual va a ser rechazado.
export const IMAGEN_TIPOS = ['image/png', 'image/jpeg', 'image/webp']
export const IMAGEN_MAX_MB = 2
