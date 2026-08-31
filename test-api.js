import 'dotenv/config';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8081';
const API_TOKEN = process.env.VITE_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (API_TOKEN) {
    config.headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  return config;
});

async function test() {
  try {
    const res = await api.get('/api/patients');
    console.log('Success! Status:', res.status);
    console.log('Data type:', typeof res.data);
    console.log('Has content?', !!res.data.content);
    console.log('Is Array?', Array.isArray(res.data.content || res.data));
    console.log('Length:', (res.data.content || res.data).length);
  } catch (err) {
    console.error('Error!', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

test();
