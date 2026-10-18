import api from './api';

export const commentService = {
  async getComments(postId) {
    const res = await api.get(`/posts/${postId}/comments`);
    return res.data.comments;
  },

  async createComment(postId, content) {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    return res.data.comment;
  },

  async updateComment(commentId, content) {
    const res = await api.put(`/comments/${commentId}`, { content });
    return res.data.comment;
  },

  async deleteComment(commentId) {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
};
