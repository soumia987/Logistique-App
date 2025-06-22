import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Annonces API
export const annoncesAPI = {
  getAll: (params) => api.get('/annonces', { params }),
  getById: (id) => api.get(`/annonces/${id}`),
  create: (annonceData) => api.post('/annonces', annonceData),
  update: (id, annonceData) => api.put(`/annonces/${id}`, annonceData),
  delete: (id) => api.delete(`/annonces/${id}`),
  getMyAnnonces: () => api.get('/annonces/my-annonces'),
  updateStatus: (id, status) => api.patch(`/annonces/${id}/status`, { statut: status }),
};

// Demandes API
export const demandesAPI = {
  create: (demandeData) => api.post('/demandes', demandeData),
  getReceived: () => api.get('/demandes/received'),
  getSent: () => api.get('/demandes/sent'),
  getById: (id) => api.get(`/demandes/${id}`),
  update: (id, demandeData) => api.put(`/demandes/${id}`, demandeData),
  updateStatus: (id, status, reason) => api.patch(`/demandes/${id}/status`, { statut: status, raison: reason }),
};

// Evaluations API
export const evaluationsAPI = {
  create: (evaluationData) => api.post('/evaluations', evaluationData),
  getUserEvaluations: (userId, params) => api.get(`/evaluations/user/${userId}`, { params }),
  getSent: (params) => api.get('/evaluations/sent', { params }),
  getById: (id) => api.get(`/evaluations/${id}`),
  update: (id, evaluationData) => api.put(`/evaluations/${id}`, evaluationData),
  delete: (id) => api.delete(`/evaluations/${id}`),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
  getAnnonces: (params) => api.get('/admin/annonces', { params }),
  updateAnnonce: (id, annonceData) => api.put(`/admin/annonces/${id}`, annonceData),
  deleteAnnonce: (id) => api.delete(`/admin/annonces/${id}`),
};

// User API (for chat, etc.)
export const userAPI = {
  getConversations: () => api.get('/users/conversations'),
  getMessages: (conversationId) => api.get(`/users/conversations/${conversationId}/messages`),
};

// Chat API
export const chatAPI = {
  getMessages: (annonceId, userId) => api.get(`/chat/${annonceId}/${userId}`),
  sendMessage: (messageData) => api.post('/chat', messageData),
  markAsRead: (messageId) => api.patch(`/chat/${messageId}/read`),
};

export default api;
