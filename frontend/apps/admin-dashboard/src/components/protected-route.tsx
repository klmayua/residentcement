'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './providers/auth-provider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended route for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirect_after_login', pathname);
      }
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && requiredRoles && requiredRoles.length > 0) {
      if (!hasRole(...requiredRoles)) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, requiredRoles, hasRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(...requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
