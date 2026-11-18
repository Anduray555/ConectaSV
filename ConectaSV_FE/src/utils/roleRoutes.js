export const HOME_BY_ROLE = {
  student: '/dashboard/explorar',
  company: '/empresa/dashboard',
  admin: '/admin/dashboard',
};

export const homeFor = (role) => HOME_BY_ROLE[role] ?? '/';

// El backend devuelve el rol en inglés ("student"); en la interfaz se muestra en español.
export const ROLE_LABEL = {
  student: 'Estudiante',
  company: 'Empresa',
  admin: 'Administrador',
};

export const roleLabel = (role) => ROLE_LABEL[role] ?? role;