import api from './api';

export const postService = {
  async getPosts(params = {}) {
    const res = await api.get('/posts', { params });
    return res.data;
  },

  async getPost(slugOrId) {
    const res = await api.get(`/posts/${slugOrId}`);
    return res.data;
  },

  async createPost(postData) {
    const res = await api.post('/posts', postData);
    return res.data;
  },

  async updatePost(id, postData) {
    const res = await api.put(`/posts/${id}`, postData);
    return res.data;
  },

  async deletePost(id) {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  async toggleLike(id) {
    const res = await api.post(`/posts/${id}/like`);
    return res.data;
  },

  async toggleBookmark(id) {
    const res = await api.post(`/posts/${id}/bookmark`);
    return res.data;
  },

  async getFeaturedPost() {
    const res = await api.get('/posts/editorial/featured');
    return res.data.post;
  },

  async getTrendingPosts() {
    const res = await api.get('/posts/editorial/trending');
    return res.data.posts;
  },

  async getRelatedPosts(id) {
    const res = await api.get(`/posts/${id}/related`);
    return res.data.posts;
  },

  async getPlatformStats() {
    const res = await api.get('/posts/editorial/stats');
    return res.data.stats;
  },
};
