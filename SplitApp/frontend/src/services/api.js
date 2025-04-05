import axios from 'axios';

// Determine the base URL for API calls
const getBaseUrl = () => {
  // Check if we have a BACKEND_URL environment variable (from Container App)
  if (process.env.REACT_APP_BACKEND_URL || window.BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL || window.BACKEND_URL;
  }
  // In development, use the proxy configured in package.json
  return '/api';
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,  // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;