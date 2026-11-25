// Pantallas de bienvenida que se muestran una sola vez (hasta que tengan onboarded_at):
//   - estudiante -> "Completa tu perfil"   (student_profile.onboarded_at)
//   - owner      -> "Invita a tu equipo"   (company_member.onboarded_at)
// Los reclutadores reciben onboarded_at al aceptar la invitación, así que no la ven.

export const RUTA_ONBOARDING = '/completar-perfil'
export const RUTA_ONBOARDING_EMPRESA = '/invitar-equipo'

/** Ruta de la pantalla de bienvenida pendiente para este usuario, o null si no tiene. */
export function rutaOnboarding(user) {
  if (user?.role === 'student' && user.student_profile && !user.student_profile.onboarded_at) {
    return RUTA_ONBOARDING
  }
  if (user?.role === 'company' && user.company_member?.is_owner && !user.company_member.onboarded_at) {
    return RUTA_ONBOARDING_EMPRESA
  }
  return null
}

export const necesitaOnboarding = (user) => rutaOnboarding(user) !== null
