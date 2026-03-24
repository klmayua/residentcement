'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Eye, EyeOff, Phone, User, MapPin, Loader2 } from 'lucide-react';

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/login?registered=true');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const GhostInput = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    required = false,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
  }) => (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-4 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
          required={required}
        />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(rgba(22, 19, 17, 0.85), rgba(22, 19, 17, 0.95)), url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Registration Card */}
      <div className="w-full max-w-[600px] bg-[#221f1d] shadow-2xl overflow-hidden relative border border-[#4d4540]/20 max-h-[90vh] overflow-y-auto">
        {/* Branding Header */}
        <div className="pt-10 pb-8 px-10 flex flex-col items-center sticky top-0 bg-[#221f1d] z-10">
          <div className="h-16 w-16 bg-[#e5c374] rounded mb-6 flex items-center justify-center">
            <span className="text-[#161311] font-headline text-xl font-bold">RC</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e9e1dd] uppercase mb-2">Create Account</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#7e7667]">Join the Distributor Network</p>
        </div>

        {/* Form */}
        <div className="px-10 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <GhostInput
                label="First Name"
                value={formData.firstName}
                onChange={(val) => handleChange('firstName', val)}
                placeholder="John"
                icon={User}
                required
              />
              <GhostInput
                label="Last Name"
                value={formData.lastName}
                onChange={(val) => handleChange('lastName', val)}
                placeholder="Doe"
                icon={User}
                required
              />
            </div>

            {/* Email */}
            <GhostInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(val) => handleChange('email', val)}
              placeholder="name@company.com"
              icon={Mail}
              required
            />

            {/* Phone */}
            <GhostInput
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(val) => handleChange('phone', val)}
              placeholder="+234 800 000 0000"
              icon={Phone}
              required
            />

            {/* Company */}
            <GhostInput
              label="Company Name"
              value={formData.companyName}
              onChange={(val) => handleChange('companyName', val)}
              placeholder="Your Company Ltd"
              icon={Building2}
              required
            />

            {/* Address */}
            <GhostInput
              label="Business Address"
              value={formData.address}
              onChange={(val) => handleChange('address', val)}
              placeholder="123 Industrial Avenue"
              icon={MapPin}
              required
            />

            {/* City & State */}
            <div className="grid md:grid-cols-2 gap-6">
              <GhostInput
                label="City"
                value={formData.city}
                onChange={(val) => handleChange('city', val)}
                placeholder="Lagos"
                icon={MapPin}
                required
              />
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 px-0 py-3 text-[#e9e1dd] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-[#221f1d] text-[#7e7667]">Select state</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state} className="bg-[#221f1d] text-[#e9e1dd]">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create password"
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
              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-[#7e7667] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-12 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#7e7667] hover:text-[#e9e1dd] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#4d4540]/30 bg-transparent text-[#e5c374] focus:ring-[#e5c374] focus:ring-offset-0"
              />
              <span className="text-sm text-[#a8a29e]">
                I agree to the{' '}
                <Link href="/terms" className="text-[#e5c374] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#e5c374] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

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
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-[#a8a29e]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#e5c374] font-medium hover:underline">
                Sign In
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
