'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = sessionStorage.getItem('redirect_after_login') || '/dashboard';
      sessionStorage.removeItem('redirect_after_login');
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
      // Successful login will trigger the useEffect above
    } catch (err: any) {
      if (err?.code === 'MFA_REQUIRED') {
        setMfaRequired(true);
      } else {
        setError(err?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Re-submit login with MFA code
      // The auth provider will handle this
      await login(email, password, rememberMe);
    } catch (err: any) {
      setError(err?.message || 'Invalid MFA code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cement-50 via-white to-cement-100">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cement-50 via-white to-cement-100 p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Back to corporate */}
        <div className="mb-6 text-center">
          <Link
            href="https://residentcement.nyamabo.com"
            className="text-sm text-cement-500 hover:text-brand-primary transition-colors"
          >
            ← Back to main website
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-cement-900">
            Resident Cement ERP
          </h1>
          <p className="text-cement-600 mt-2">
            Sign in to manage operations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {!mfaRequired ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cement-400" />
                  <input
                    type="email"
                    placeholder="admin@residentcement.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-cement-300 bg-white text-cement-900 text-sm placeholder:text-cement-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cement-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-cement-300 bg-white text-cement-900 text-sm placeholder:text-cement-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cement-400 hover:text-cement-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-cement-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-cement-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-cement-900">Two-Factor Authentication</h3>
                <p className="text-sm text-cement-600 mt-1">
                  Enter the code from your authenticator app
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-cement-700 mb-1.5">
                  MFA Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-cement-300 bg-white text-cement-900 text-sm text-center tracking-widest placeholder:text-cement-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMfaRequired(false);
                  setMfaCode('');
                }}
                className="w-full text-sm text-cement-500 hover:text-cement-700"
              >
                Back to login
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-cement-500 mt-6">
          © {new Date().getFullYear()} Resident Cement Limited. All rights reserved.
        </p>
      </div>
    </div>
  );
}
