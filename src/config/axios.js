import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with an error
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data?.message || 'An error occurred');
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      return Promise.reject('No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject('Error setting up request');
    }
  }
);

export default api;
