import api from './client'

// Endpoints del panel de administración (requieren sesión con rol admin).
// `signal` permite cancelar la petición si la pantalla se desmonta o cambian los filtros.
export const adminApi = {
  // Totales del panel y últimos registros.
  summary: ({ signal } = {}) => api.get('/admin/summary', { signal }).then((r) => r.data),

  // params: { search, role: 'student'|'company', status: 'active'|'suspended', page, per_page }
  users: (params, { signal } = {}) => api.get('/admin/users', { params, signal }).then((r) => r.data),

  // Activa (true) o suspende (false). Suspender cierra todas las sesiones del usuario.
  updateStatus: (id, isActive) =>
    api.patch(`/admin/users/${id}/status`, { is_active: isActive }).then((r) => r.data.data),
}
