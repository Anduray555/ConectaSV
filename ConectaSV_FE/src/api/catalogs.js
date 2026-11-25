import api from './client';

export const catalogApi = {
  universities: () => api.get('/universities').then((r) => r.data),
  careers: (universityId) => api.get(`/universities/${universityId}/careers`).then((r) => r.data),
  sectors: () => api.get('/sectors').then((r) => r.data),
  offerTypes: () => api.get('/offer-types').then((r) => r.data),
  // [{ id, name, slug, is_general, matches_career, tags: [{ id, name, slug, category_id }] }]
  // Con careerId, primero vienen las categorías del área de esa carrera, luego las generales.
  tags: (careerId) =>
    api.get('/tags', { params: careerId ? { career_id: careerId } : {} }).then((r) => r.data),
};