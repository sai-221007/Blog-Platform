import api from './api';

export const newsletterService = {
  async subscribe(email) {
    const res = await api.post('/newsletter/subscribe', { email });
    return res.data;
  },
};
