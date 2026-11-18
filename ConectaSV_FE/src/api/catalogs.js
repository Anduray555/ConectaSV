import api from './client';

export const catalogApi = {
  universities: () => api.get('/universities').then((r) => r.data),
  careers: (universityId) => api.get(`/universities/${universityId}/careers`).then((r) => r.data),
  sectors: () => api.get('/sectors').then((r) => r.data),
};