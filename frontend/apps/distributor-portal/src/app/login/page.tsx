'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(rgba(22, 19, 17, 0.85), rgba(22, 19, 17, 0.95)), url(https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-[480px] bg-[#221f1d] shadow-2xl overflow-hidden relative border border-[#4d4540]/20">
        {/* Branding Header */}
        <div className="pt-16 pb-12 px-12 flex flex-col items-center">
          <div className="h-20 w-20 bg-[#e5c374] rounded mb-8 flex items-center justify-center">
            <span className="text-[#161311] font-headline text-2xl font-bold">RC</span>
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-[#e9e1dd] uppercase mb-2">Distributor Portal</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#7e7667]">Industrial Strength. Architectural Elegance.</p>
        </div>

        {/* Form */}
        <div className="px-12 pb-16">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-4 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-12 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#7e7667] hover:text-[#e9e1dd] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#4d4540]/30 bg-transparent text-[#e5c374] focus:ring-[#e5c374]"
                />
                <span className="text-sm text-[#a8a29e]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#e5c374] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] rounded text-[#161311] transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(45deg, #745B17, #e5c374)',
                boxShadow: '0 4px 15px rgba(229, 195, 116, 0.3)'
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-[#a8a29e]">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-[#e5c374] font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center border-t border-[#292524]">
          <p className="text-xs text-[#57534e]">&copy; 2024 Resident Cement. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
