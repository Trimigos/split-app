import api from './api';

const userService = {
  // Authentication
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // User data
  getCurrentUser: () => {
    return api.get('/users/me');
  },
  
  updateProfile: (userData) => {
    return api.put('/users/me', userData);
  },
  
  // Store auth data in localStorage
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Get stored auth data
  getAuthData: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  }
};

export default userService;