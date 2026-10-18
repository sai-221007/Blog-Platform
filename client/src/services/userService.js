import api from './api';

export const userService = {
  async getUserProfile(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async getUserPosts(id) {
    const res = await api.get(`/users/${id}/posts`);
    return res.data.posts;
  },

  async getDashboard() {
    const res = await api.get('/users/me/dashboard');
    return res.data;
  },
};
