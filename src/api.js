import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ctmss.onrender.com';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjdG1zcy5vcmciLCJyb2xlcyI6WyJST0xFX0FETUlOIiwiUk9MRV9QSSIsIlJPTEVfUFYiXSwiaWF0IjoxNzg4MTE1MjQ1LCJleHAiOjE4MTk2NTEyNDV9.0O-qQRZdtskCqnpI5adCKEsFuzhWJehouzZjCA8ULY4';

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
