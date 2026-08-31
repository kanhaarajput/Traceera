import axios from 'axios';

const API_URL = ''; // Rely on proxy (vite.config.js / vercel.json)

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to append the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
