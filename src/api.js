import axios from 'axios';

const API_URL = ''; // Use relative path to hit the Vite proxy
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to append the token
api.interceptors.request.use(
  (config) => {
    if (API_TOKEN) {
      config.headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
