'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate session
    const initAuth = async () => {
      if (token) {
        try {
          // Set token in localStorage for API calls
          localStorage.setItem('token', token);
          // Fetch current user
          const response = await authApi.me();
          setUser(response.data.data);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          storeLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token, setUser, storeLogout]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { user, token } = response.data.data;
    storeLogin(user, token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    storeLogout();
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.data);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
