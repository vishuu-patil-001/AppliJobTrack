// services/api.js
// Centralizes all API calls — import from here, not raw fetch/axios

import axios from 'axios';

// Base URL from env variable, falls back to proxy in development
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (expired/invalid token) — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ── Grocery Items ──
export const getItems = (params) => API.get('/grocery', { params });
export const addItem = (data) => API.post('/grocery', data);
export const updateItem = (id, data) => API.put(`/grocery/${id}`, data);
export const deleteItem = (id) => API.delete(`/grocery/${id}`);
export const updateQuantity = (id, change) => API.patch(`/grocery/${id}/quantity`, { change });
export const toggleShoppingList = (id) => API.patch(`/grocery/${id}/shopping-list`);

// ── Dashboard ──
export const getDashboard = () => API.get('/grocery/dashboard');

export default API;
