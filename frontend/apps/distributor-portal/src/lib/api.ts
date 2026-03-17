import axios, { AxiosInstance } from 'axios';

// In production (Docker), API calls go to relative /api/v1/* which Nginx proxies to gateway
// In development, set NEXT_PUBLIC_API_URL=http://localhost:3001 in .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api: AxiosInstance & { setToken: (token: string | null) => void } = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as any;

// Add setToken method
api.setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/api/v1/auth/register', data),
  refreshToken: (refreshToken: string) =>
    api.post('/api/v1/auth/refresh', { refreshToken }),
  me: () =>
    api.get('/api/v1/auth/me'),
};

export const customersApi = {
  list: (params?: any) => api.get('/api/v1/customers', { params }),
  get: (id: string) => api.get(`/api/v1/customers/${id}`),
  create: (data: any) => api.post('/api/v1/customers', data),
  update: (id: string, data: any) => api.patch(`/api/v1/customers/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/customers/${id}`),
  getCreditStatus: (id: string) => api.get(`/api/v1/customers/${id}/credit-status`),
};

export const productsApi = {
  list: (params?: any) => api.get('/api/v1/products', { params }),
  get: (id: string) => api.get(`/api/v1/products/${id}`),
  getAvailability: (id: string) => api.get(`/api/v1/products/${id}/availability`),
  create: (data: any) => api.post('/api/v1/products', data),
  update: (id: string, data: any) => api.patch(`/api/v1/products/${id}`, data),
};

export const ordersApi = {
  list: (params?: any) => api.get('/api/v1/orders', { params }),
  get: (id: string) => api.get(`/api/v1/orders/${id}`),
  create: (data: any) => api.post('/api/v1/orders', data),
  update: (id: string, data: any) => api.patch(`/api/v1/orders/${id}`, data),
  cancel: (id: string, reason: string) => api.patch(`/api/v1/orders/${id}/cancel`, { reason }),
  updateStatus: (id: string, status: string) => api.patch(`/api/v1/orders/${id}/status`, { status }),
};

export const inventoryApi = {
  list: (params?: any) => api.get('/api/v1/inventory', { params }),
  get: (id: string) => api.get(`/api/v1/inventory/${id}`),
  reserve: (data: any) => api.post('/api/v1/inventory/reserve', data),
  release: (data: any) => api.post('/api/v1/inventory/release', data),
  getLowStock: () => api.get('/api/v1/inventory/low-stock'),
};

export const warehousesApi = {
  list: () => api.get('/api/v1/warehouses'),
  get: (id: string) => api.get(`/api/v1/warehouses/${id}`),
};

export const pricingApi = {
  calculate: (data: any) => api.post('/api/v1/pricing/calculate', data),
  getRules: (params?: any) => api.get('/api/v1/pricing/rules', { params }),
  createRule: (data: any) => api.post('/api/v1/pricing/rules', data),
};

export const quotesApi = {
  list: (params?: any) => api.get('/api/v1/quotes', { params }),
  get: (id: string) => api.get(`/api/v1/quotes/${id}`),
  create: (data: any) => api.post('/api/v1/quotes', data),
  convert: (id: string) => api.post(`/api/v1/quotes/${id}/convert`),
};

export const paymentsApi = {
  list: (params?: any) => api.get('/api/v1/payments', { params }),
  get: (id: string) => api.get(`/api/v1/payments/${id}`),
  initiate: (data: any) => api.post('/api/v1/payments/initiate', data),
  verify: (reference: string) => api.post(`/api/v1/payments/verify/${reference}`),
};
