import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  },
);

export const pingBackend = async () => {
  const response = await api.get('/');
  return response.data;
};
