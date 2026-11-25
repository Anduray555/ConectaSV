// ¿Hay que mostrarle "Completa tu perfil" a este usuario?
// Solo a estudiantes cuyo perfil todavía no tiene onboarded_at (viene de GET /api/auth/me).
export const necesitaOnboarding = (user) =>
  user?.role === 'student' && Boolean(user.student_profile) && !user.student_profile.onboarded_at

export const RUTA_ONBOARDING = '/completar-perfil'
