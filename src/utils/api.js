// @ts-nocheck
import axios from 'axios';

// For Vite projects
const baseURL = import.meta.env.VITE_API_URL || 'https://wallpapermosaic.onrender.com';


console.log('Base URL:', baseURL);  // For debugging

const apiEndpoint = `${baseURL}/api`;
console.log('API Endpoint:', apiEndpoint);  // For debugging

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

export const subscribeEmail = (email) => {
  console.log('Subscribing email:', email);
  console.log('Full subscribe URL:', `${apiEndpoint}/subscription/subscribe`);
  
  return api.post('/subscription/subscribe', { email })
    .catch(error => {
      console.error('Subscription error:', error.response || error);
      throw error;
    });
};
export const unsubscribeEmail = (email) => api.post('/subscription/unsubscribe', { email });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const logout = () => api.post('/auth/logout');
export const sendEmails = (sportsUrl, carsUrl, movieUrl) => 
  api.post('/email/send-emails', { sportsUrl, carsUrl, movieUrl });
export const getSubscribers = () => api.get('/subscription/subscribers');

export default api;