'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
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
      <div className="w-full max-w-[480px] bg-[#221f1d] shadow-2xl overflow-hidden relative border border-[#4d4540]/20">
        {/* Branding Header */}
        <div className="pt-16 pb-12 px-12 flex flex-col items-center">
          <div className="h-20 w-20 bg-[#e5c374] rounded mb-8 flex items-center justify-center">
            <span className="text-[#161311] font-headline text-2xl font-bold">RC</span>
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-[#e9e1dd] uppercase mb-2">Reset Password</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#7e7667]">Industrial Strength. Architectural Elegance.</p>
        </div>

        <div className="px-12 pb-16">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 border border-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-[#e9e1dd] mb-4">Check Your Email</h2>
              <p className="text-[#a8a29e] mb-8">We&apos;ve sent a password reset link to {email}. Please check your inbox and follow the instructions.</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-[#e5c374] hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[#a8a29e] text-center mb-8">Enter your email address and we&apos;ll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] rounded text-[#161311] transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(45deg, #745B17, #e5c374)',
                    boxShadow: '0 4px 15px rgba(229, 195, 116, 0.3)'
                  }}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-[#e5c374] hover:underline">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="py-6 text-center border-t border-[#292524]">
          <p className="text-xs text-[#57534e]">&copy; 2024 Resident Ciment. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

