import axios from 'axios';
import process from 'process';

const baseURL = process.env.API_URL;
const apiEndpoint = `${baseURL}/api`;

const api = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const subscribeEmail = (email) => api.post('/subscription/subscribe', { email });
export const unsubscribeEmail = (email) => api.post('/subscription/unsubscribe', { email });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const logout = () => api.post('/auth/logout');
export const sendEmails = (sportsUrl, carsUrl, movieUrl) => 
  api.post('/email/send-emails', { sportsUrl, carsUrl, movieUrl });
export const getSubscribers = () => api.get('/subscription/subscribers');

export default api;