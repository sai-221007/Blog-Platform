import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('inkora_token', res.data.token);
      localStorage.setItem('inkora_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('inkora_token', res.data.token);
      localStorage.setItem('inkora_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    if (res.data.user) {
      localStorage.setItem('inkora_user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/me', profileData);
    if (res.data.user) {
      localStorage.setItem('inkora_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Continue client cleanup regardless of server response
    }
    localStorage.removeItem('inkora_token');
    localStorage.removeItem('inkora_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('inkora_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('inkora_token');
  },
};
