import api from './client'

// Invitaciones de la empresa (solo owner; el backend responde 403 a los reclutadores).
export const companyInvitationsApi = {
  // [{ id, email, role, status: 'pending'|'expired', expires_at, created_at, invited_by }]
  list: () => api.get('/company/invitations').then((r) => r.data.data),

  // email opcional. Devuelve { invitation, link, email_sent }.
  // OJO: `link` solo llega aquí; después el servidor ya no lo conoce (guarda un hash).
  create: (email) => api.post('/company/invitations', email ? { email } : {}).then((r) => r.data),

  revoke: (id) => api.delete(`/company/invitations/${id}`).then((r) => r.data),

  // Marca que el owner ya pasó por "Invita a tu equipo".
  completeOnboarding: () => api.post('/company/onboarding').then((r) => r.data),
}

// Rutas públicas: quien abre el link todavía no tiene cuenta.
export const publicInvitationsApi = {
  // { company: { name, sector, logo_url }, email, role, invited_by, expires_at }
  show: (token) => api.get(`/invitations/${token}`).then((r) => r.data),

  // Crea la cuenta del reclutador. Devuelve { token, user } (igual que login).
  accept: (token, data) => api.post(`/invitations/${token}/accept`, data).then((r) => r.data),
}
