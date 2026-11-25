import api from './client'

// Endpoints del estudiante autenticado (requieren sesión con rol student).
export const studentApi = {
  // Tags del estudiante: [{ id, name, slug, category_id }]
  tags: () => api.get('/student/tags').then((r) => r.data.data),

  // Reemplaza la lista completa (máximo 10). Devuelve la lista guardada.
  updateTags: (tagIds) => api.put('/student/tags', { tag_ids: tagIds }).then((r) => r.data.data),

  // Marca que ya pasó por "Completa tu perfil" (la terminó o la omitió).
  completeOnboarding: () => api.post('/student/onboarding').then((r) => r.data),
}
