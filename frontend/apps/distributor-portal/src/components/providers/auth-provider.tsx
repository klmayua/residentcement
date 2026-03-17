"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
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
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.setToken(token);
    try {
      const response = await authApi.me();
      setUser(response.data as User);
    } catch {
      localStorage.removeItem("auth_token");
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    api.setToken(response.data.token);
    await fetchUser();
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  }) => {
    await authApi.register(data);
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
