import api from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((r) => r.data),
  registerStudent: (data) => api.post('/auth/register/student', data).then((r) => r.data),
  registerCompany: (data) => api.post('/auth/register/company', data).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};  