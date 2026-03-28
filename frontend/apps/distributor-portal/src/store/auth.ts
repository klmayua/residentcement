import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
}

export interface Customer {
  id: string;
  userId: string;
  email?: string;
  companyName: string;
  rcNumber?: string;
  tinNumber?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  creditLimit?: number;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, customer?: Customer) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      customer: null,
      token: null,
      isAuthenticated: false,

      login: (token, user, customer) => set({ token, user, customer: customer || null, isAuthenticated: true }),

      logout: () => set({ user: null, customer: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
