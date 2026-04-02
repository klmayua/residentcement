import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  leadTime: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  client: string;
  project: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PENDING';
  date: string;
  dueDate: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
  creditLimit?: number;
  creditUsed?: number;
}

// API functions
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/v1/auth/login', { email, password }),
  register: (data: Partial<User> & { password: string }) =>
    apiClient.post('/api/v1/auth/register', data),
  forgotPassword: (email: string) =>
    apiClient.post('/api/v1/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post('/api/v1/auth/reset-password', { token, password }),
  me: () => apiClient.get<ApiResponse<User>>('/api/v1/auth/me'),
};

export const productsApi = {
  list: (params?: { limit?: number; page?: number; category?: string }) =>
    apiClient.get<ApiResponse<Product[]>>('/api/v1/products', { params }),
  get: (id: string) => apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`),
  checkAvailability: (id: string, quantity: number) =>
    apiClient.get(`/api/v1/products/${id}/availability`, { params: { quantity } }),
};

export const ordersApi = {
  list: (params?: { limit?: number; page?: number; status?: string }) =>
    apiClient.get<ApiResponse<Order[]>>('/api/v1/orders', { params }),
  get: (id: string) => apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`),
  create: (data: Partial<Order>) => apiClient.post<ApiResponse<Order>>('/api/v1/orders', data),
  update: (id: string, data: Partial<Order>) =>
    apiClient.patch<ApiResponse<Order>>(`/api/v1/orders/${id}`, data),
  cancel: (id: string) => apiClient.post(`/api/v1/orders/${id}/cancel`),
};

export const invoicesApi = {
  list: (params?: { limit?: number; page?: number; status?: string }) =>
    apiClient.get<ApiResponse<Invoice[]>>('/api/v1/invoices', { params }),
  get: (id: string) => apiClient.get<ApiResponse<Invoice>>(`/api/v1/invoices/${id}`),
  pay: (id: string, paymentMethod: string) =>
    apiClient.post(`/api/v1/invoices/${id}/pay`, { paymentMethod }),
};

export const inventoryApi = {
  getLevels: () => apiClient.get<ApiResponse<{ productId: string; quantity: number }[]>>('/api/v1/inventory'),
  getByProduct: (productId: string) => apiClient.get(`/api/v1/inventory/product/${productId}`),
};

export const paymentsApi = {
  list: (params?: { limit?: number; page?: number }) =>
    apiClient.get('/api/v1/payments', { params }),
  initiate: (invoiceId: string, amount: number, method: string) =>
    apiClient.post('/api/v1/payments/initiate', { invoiceId, amount, method }),
  verify: (reference: string) => apiClient.get(`/api/v1/payments/verify/${reference}`),
};

export default apiClient;
