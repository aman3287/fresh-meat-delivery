import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
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

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data)
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  rate: (id, rating) => api.put(`/orders/${id}/rate`, rating)
};

// User APIs
export const userAPI = {
  addAddress: (data) => api.post('/users/address', data),
  getAddresses: () => api.get('/users/address'),
  updateAddress: (id, data) => api.put(`/users/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/address/${id}`),
  updateDeliveryProfile: (data) => api.put('/users/delivery-profile', data)
};

// Delivery APIs
export const deliveryAPI = {
  getAvailableOrders: (params) => api.get('/delivery/available-orders', { params }),
  acceptOrder: (orderId) => api.post(`/delivery/accept-order/${orderId}`),
  updateLocation: (data) => api.put('/delivery/update-location', data),
  toggleAvailability: () => api.put('/delivery/toggle-availability'),
  getEarnings: (params) => api.get('/delivery/earnings', { params })
};

export default api;
