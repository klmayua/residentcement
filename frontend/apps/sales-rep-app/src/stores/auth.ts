import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SalesRep {
  id: string;
  name: string;
  email: string;
  territory: string;
  token: string;
}

interface AuthState {
  salesRep: SalesRep | null;
  isAuthenticated: boolean;
  isOnline: boolean;
  login: (salesRep: SalesRep) => void;
  logout: () => void;
  setOnline: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      salesRep: null,
      isAuthenticated: false,
      isOnline: true,
      login: (salesRep) => set({ salesRep, isAuthenticated: true }),
      logout: () => set({ salesRep: null, isAuthenticated: false }),
      setOnline: (status) => set({ isOnline: status }),
    }),
    { name: "sales-rep-auth" }
  )
);
