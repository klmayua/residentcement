const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiError {
  code: string;
  message: string;
  errors?: Array<{ message: string; path: string }>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          code: "UNKNOWN_ERROR",
          message: `Request failed with status ${response.status}`,
        }));
        throw error;
      }

      return response.json();
    } catch (error) {
      if ((error as ApiError).code) {
        throw error;
      }
      throw {
        code: "NETWORK_ERROR",
        message: "Network error. Please check your connection.",
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return this.request<T>(url.pathname + url.search, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE_URL);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: unknown }>("/api/v1/auth/login", {
      email,
      password,
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  }) => api.post<{ message: string; userId: string }>("/api/v1/auth/register", data),

  logout: () => api.post<{ message: string }>("/api/v1/auth/logout"),

  me: () => api.get<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    role: string;
    phone: string;
  }>("/api/v1/auth/me"),
};

export const customerApi = {
  list: (params?: { page?: number; limit?: number; search?: string; tier?: string }) =>
    api.get<{ data: unknown[]; pagination: unknown }>("/api/v1/customers", params as Record<string, string>),

  get: (id: string) => api.get<unknown>(`/api/v1/customers/${id}`),

  update: (id: string, data: unknown) =>
    api.patch<unknown>(`/api/v1/customers/${id}`, data),
};

export const productApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    grade?: string;
    inStock?: boolean;
  }) => api.get<{ data: unknown[]; pagination: unknown }>("/api/v1/products", params as Record<string, string>),

  get: (id: string) => api.get<unknown>(`/api/v1/products/${id}`),

  getAvailability: (id: string) =>
    api.get<unknown>(`/api/v1/products/${id}/availability`),
};

export const orderApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<{ data: unknown[]; pagination: unknown }>("/api/v1/orders", params as Record<string, string>),

  get: (id: string) => api.get<unknown>(`/api/v1/orders/${id}`),

  create: (data: {
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: string;
    deliveryDate?: string;
    paymentMethod: "bank_transfer" | "card" | "ussd";
    notes?: string;
  }) => api.post<unknown>("/api/v1/orders", data),

  cancel: (id: string) => api.patch<unknown>(`/api/v1/orders/${id}/cancel`, {}),
};

export const paymentApi = {
  initiate: (data: {
    orderId: string;
    amount: number;
    paymentMethod: "bank_transfer" | "card" | "ussd";
    callbackUrl?: string;
  }) => api.post<unknown>("/api/v1/payments/initiate", data),

  get: (id: string) => api.get<unknown>(`/api/v1/payments/${id}`),

  getStatus: (id: string) => api.get<unknown>(`/api/v1/payments/${id}/status`),

  list: (params?: { orderId?: string; status?: string }) =>
    api.get<{ data: unknown[] }>("/api/v1/payments", params as Record<string, string>),
};

export const quoteApi = {
  calculate: (data: {
    customerId: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryLocation?: string;
    validityDays?: number;
  }) => api.post<unknown>("/api/v1/quotes/calculate", data),

  list: () => api.get<{ data: unknown[] }>("/api/v1/quotes"),

  get: (id: string) => api.get<unknown>(`/api/v1/quotes/${id}`),

  convert: (id: string) => api.post<unknown>(`/api/v1/quotes/${id}/convert`, {}),
};

export const inventoryApi = {
  list: (params?: { productId?: string; location?: string }) =>
    api.get<{ data: unknown[] }>("/api/v1/inventory", params as Record<string, string>),

  get: (id: string) => api.get<unknown>(`/api/v1/inventory/${id}`),

  adjust: (data: {
    productId: string;
    location: string;
    adjustment: number;
    reason: string;
  }) => api.post<unknown>("/api/v1/inventory/adjust", data),
};
