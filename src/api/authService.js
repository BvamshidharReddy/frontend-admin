import { apiClient } from './apiClient';

// Authentication service
const authService = {
  // Login user and get token
  login: async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Register new user
  register: async (userData) => {
    return apiClient.post('users/', userData);
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('users/me/');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Update user profile
  updateProfile: async (id, userData) => {
    return apiClient.patch(`users/${id}/`, userData);
  },
};

export default authService;
export { apiClient };