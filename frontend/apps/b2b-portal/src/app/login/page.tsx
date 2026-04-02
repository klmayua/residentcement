'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useState(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(229,195,116,0.06) 0%, transparent 60%), #161311',
      }}
    >
      {/* Back navigation */}
      <div className="w-full max-w-[480px] mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#a8a29e] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          B2B Portal
        </Link>
        <a
          href="https://residentcement.nyamabo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#e5c374] transition-colors"
        >
          Main Website →
        </a>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[480px] bg-[#221f1d] overflow-hidden border border-[#292524]/40">
        {/* Branding Header */}
        <div className="pt-12 pb-8 px-12 flex flex-col items-center border-b border-[#292524]/30">
          <div className="font-serif text-2xl font-bold text-[#e5c374] mb-2">
            ResidentCiment
          </div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-[#e9e1dd] uppercase mb-1">
            Partner Portal
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534e]">
            Enterprise Procurement Platform
          </p>
        </div>

        {/* Form */}
        <div className="px-12 py-10">
          {successMessage && (
            <div className="mb-6 p-4 bg-[#1c1917] border border-[#e5c374]/20 text-[#e5c374] text-xs leading-relaxed">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-3">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-4 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] uppercase tracking-widest text-[#57534e]">
                  Access Key
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-10 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#57534e] hover:text-[#a8a29e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep me signed in */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative w-4 h-4 flex-shrink-0">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-[#4d4540]/40 bg-transparent appearance-none checked:bg-[#e5c374] checked:border-[#e5c374] focus:outline-none focus:ring-0 cursor-pointer transition-colors"
                />
              </div>
              <span className="text-xs text-[#a8a29e]">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              style={{
                background: 'linear-gradient(45deg, #745B17, #e5c374)',
                boxShadow: '0 4px 20px rgba(229, 195, 116, 0.2)',
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>

          {/* Request Access */}
          <div className="mt-8 pt-8 border-t border-[#292524]/30 text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-3">
              New Enterprise Partner?
            </p>
            <a
              href="mailto:partnerships@residentciment.com"
              className="text-[11px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-5 border-t border-[#292524]/30 flex justify-between items-center">
          <p className="text-[10px] text-[#4d4540]">&copy; {new Date().getFullYear()} Resident Ciment Bauchi Ltd.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-[10px] text-[#4d4540] hover:text-[#7e7667] transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] text-[#4d4540] hover:text-[#7e7667] transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
