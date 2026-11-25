import api from './client'

// Miembros de la empresa (solo owner; el backend responde 403 a los reclutadores).
export const companyMembersApi = {
  // [{ id, full_name, email, phone, avatar_url, role, is_owner, is_active, joined_at }]
  list: () => api.get('/company/members').then((r) => r.data.data),

  // Desactivar (false) cierra todas las sesiones de ese reclutador. Devuelve el miembro actualizado.
  updateStatus: (id, isActive) =>
    api.patch(`/company/members/${id}/status`, { is_active: isActive }).then((r) => r.data.data),
}
