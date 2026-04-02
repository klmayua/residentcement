'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string | null;
  status: string;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (...roles: string[]) => boolean;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission matrix based on roles
const PERMISSION_MATRIX: Record<string, Record<string, string[]>> = {
  dashboard: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'LOGISTICS_COORDINATOR', 'SALES_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'LOGISTICS_COORDINATOR', 'SALES_MANAGER'],
  },
  orders: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'LOGISTICS_COORDINATOR', 'SALES_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'SALES_MANAGER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  products: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'SALES_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER', 'SALES_MANAGER'],
  },
  inventory: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'SALES_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'OPERATIONS_MANAGER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  customers: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'LOGISTICS_COORDINATOR', 'SALES_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'SALES_MANAGER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  production: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  logistics: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER', 'LOGISTICS_COORDINATOR', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'LOGISTICS_COORDINATOR'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  payments: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'FINANCE_OFFICER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'FINANCE_OFFICER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  quality: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER', 'VIEWER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER', 'OPERATIONS_MANAGER'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  users: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE'],
    write: ['SYSTEM_ADMINISTRATOR'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
  settings: {
    read: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE', 'DEPARTMENT_MANAGER'],
    write: ['SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE'],
    delete: ['SYSTEM_ADMINISTRATOR'],
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  const isAuthenticated = !!user;

  // Check for stored tokens on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      try {
        const parsed = JSON.parse(storedTokens);
        setTokens(parsed);
        fetchUser(parsed.accessToken);
      } catch {
        localStorage.removeItem('auth_tokens');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!tokens) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, (tokens.expiresIn - 60) * 1000); // Refresh 1 minute before expiry

    return () => clearInterval(refreshInterval);
  }, [tokens]);

  const fetchUser = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        // Token expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.code === 'MFA_REQUIRED') {
        throw { code: 'MFA_REQUIRED', message: data.message };
      }
      throw new Error(data.message || 'Login failed');
    }

    const { user: userData, tokens: tokenData } = data.data;

    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('auth_tokens', JSON.stringify(tokenData));
  };

  const logout = async () => {
    if (tokens?.refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth_tokens');
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!tokens?.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = data.data.tokens;
        setTokens(newTokens);
        localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
        return true;
      } else {
        // Refresh token expired
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const hasRole = useCallback((...roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const hasPermission = useCallback((module: string, action: string): boolean => {
    if (!user) return false;
    const modulePerms = PERMISSION_MATRIX[module];
    if (!modulePerms) return false;
    const allowedRoles = modulePerms[action];
    if (!allowedRoles) return false;
    return allowedRoles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
