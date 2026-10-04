import axios from 'axios';
import demoAdapter from './demo';

export const DEMO = process.env.REACT_APP_DEMO === 'true';

// Une seule origine pour toutes les requêtes : le cookie JWT posé au login
// n'est renvoyé que si l'hôte est identique (localhost et 127.0.0.1 diffèrent).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
  ...(DEMO && { adapter: demoAdapter }),
});

export const getOperations = () => api.get('/operations').then((r) => r.data);
export const getOperation = (id) => api.get(`/operations/${id}`).then((r) => r.data);
export const createOperation = (data) => api.post('/operations', data).then((r) => r.data);
export const updateOperation = (id, data) => api.put(`/operations/${id}`, data).then((r) => r.data);
export const deleteOperation = (id) => api.delete(`/operations/${id}`).then((r) => r.data);

export const getCategories = () => api.get('/categories').then((r) => r.data);

export const getProfile = () => api.get('/profil').then((r) => r.data);
export const updateProfile = (data) => api.put('/profil', data).then((r) => r.data);

export const login = (username, password) => api.post('/login', { username, password });
export const register = (username, password) => api.post('/register', { username, password });

export const errorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data?.error || fallback;

export default api;
