'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Mail, Lock, Eye, EyeOff, Phone, User, MapPin,
  Loader2, ArrowLeft, ArrowRight, CheckCircle, Package,
} from 'lucide-react';

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const monthlyVolumes = [
  'Under 100 Tonnes',
  '100 – 500 Tonnes',
  '500 – 1,000 Tonnes',
  '1,000 – 5,000 Tonnes',
  'Over 5,000 Tonnes',
];

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'Public Limited Company (PLC)',
  'Cooperative',
];

interface FormData {
  // Step 1 — Business Profile
  companyName: string;
  rcNumber: string;
  businessType: string;
  yearsInOperation: string;
  // Step 2 — Contact & Location
  contactFirstName: string;
  contactLastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  // Step 3 — Distribution Capacity
  coverageStates: string[];
  monthlyVolume: string;
  hasWarehouse: string;
  warehouseCapacity: string;
  hasExistingClients: string;
  // Step 4 — Account Setup
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold transition-all ${
              i < current
                ? 'bg-[#e5c374] text-[#161311]'
                : i === current
                ? 'border-2 border-[#e5c374] text-[#e5c374]'
                : 'border border-[#292524] text-[#57534e]'
            }`}
          >
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 transition-all ${i < current ? 'bg-[#e5c374]' : 'bg-[#292524]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  label, type = 'text', value, onChange, placeholder, icon: Icon, required = false, readOnly = false,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon?: React.ComponentType<{ className?: string }>;
  required?: boolean; readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full bg-transparent border-0 border-b border-[#4d4540]/40 ${Icon ? 'pl-8' : 'pl-0'} pr-4 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          required={required}
        />
      </div>
    </div>
  );
}

function FieldSelect({
  label, value, onChange, options, placeholder, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 px-0 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all appearance-none cursor-pointer"
        required={required}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2357534e\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
      >
        <option value="" className="bg-[#221f1d] text-[#57534e]">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#221f1d] text-[#e9e1dd]">{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<FormData>({
    companyName: '', rcNumber: '', businessType: '', yearsInOperation: '',
    contactFirstName: '', contactLastName: '', jobTitle: '', email: '', phone: '',
    address: '', city: '', state: '',
    coverageStates: [], monthlyVolume: '', hasWarehouse: '', warehouseCapacity: '', hasExistingClients: '',
    password: '', confirmPassword: '', agreed: false,
  });

  const set = (field: keyof FormData, value: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCoverageState = (state: string) => {
    set('coverageStates', form.coverageStates.includes(state)
      ? form.coverageStates.filter((s) => s !== state)
      : [...form.coverageStates, state]);
  };

  const stepTitles = [
    { label: 'Business Profile', icon: Building2 },
    { label: 'Contact & Location', icon: MapPin },
    { label: 'Distribution Capacity', icon: Package },
    { label: 'Account Setup', icon: Lock },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step < stepTitles.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agreed) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: POST to /api/v1/dealer-applications
      await new Promise((r) => setTimeout(r, 1500));
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Submission failed. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: '#161311' }}
      >
        <div className="w-full max-w-[520px] text-center">
          <div className="w-16 h-16 bg-[#e5c374] flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-8 h-8 text-[#161311]" />
          </div>
          <h1 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-4">Application Received</h1>
          <p className="text-[#a8a29e] text-sm leading-relaxed mb-4">
            Thank you, <strong className="text-[#e9e1dd]">{form.contactFirstName}</strong>. Your dealership application for{' '}
            <strong className="text-[#e9e1dd]">{form.companyName}</strong> has been submitted successfully.
          </p>
          <p className="text-[#7e7667] text-sm leading-relaxed mb-10">
            Our partnerships team will review your application and reach out to <strong className="text-[#a8a29e]">{form.email}</strong>{' '}
            within 3–5 business days with next steps.
          </p>
          <div className="grid grid-cols-3 gap-px bg-[#292524]/30 mb-10">
            <div className="bg-[#1c1917] p-5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Reference</p>
              <p className="text-sm font-bold text-[#e9e1dd]">RCD-{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="bg-[#1c1917] p-5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Status</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Under Review</span>
              </div>
            </div>
            <div className="bg-[#1c1917] p-5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Timeline</p>
              <p className="text-sm font-bold text-[#e9e1dd]">3–5 Days</p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161311] py-8 px-6">
      {/* Back nav */}
      <div className="max-w-[680px] mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#a8a29e] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dealer Portal
        </Link>
      </div>

      <div className="max-w-[680px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="h-12 w-48 mb-6" style={{ background: '#e5c374', WebkitMaskImage: "url('/images/logo.png')", maskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "left center", maskPosition: "left center" }} role="img" aria-label="Resident Cement" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e5c374] mb-3 block">
            Partnership Application
          </span>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-[#e9e1dd] mb-2">
            Become an Authorised<br />Resident Cement Dealer
          </h1>
          <p className="text-[#7e7667] text-sm">
            Complete all four sections below. Applications are reviewed within 3–5 business days.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} total={stepTitles.length} />

        {/* Current step label */}
        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-[#292524]/30">
          {(() => { const Icon = stepTitles[step].icon; return <Icon className="w-5 h-5 text-[#e5c374]" />; })()}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#57534e]">Step {step + 1} of {stepTitles.length}</p>
            <h2 className="font-headline text-xl font-semibold text-[#e9e1dd]">{stepTitles[step].label}</h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* ── Step 0: Business Profile ── */}
        {step === 0 && (
          <form onSubmit={handleNext} className="space-y-7">
            <FieldInput label="Company / Business Name" value={form.companyName} onChange={(v) => set('companyName', v)}
              placeholder="Acme Building Supplies Ltd" icon={Building2} required />
            <FieldInput label="CAC Registration Number (RC)" value={form.rcNumber} onChange={(v) => set('rcNumber', v)}
              placeholder="RC-0000000" required />
            <div className="grid grid-cols-2 gap-6">
              <FieldSelect label="Business Type" value={form.businessType} onChange={(v) => set('businessType', v)}
                options={businessTypes} placeholder="Select type" required />
              <FieldSelect label="Years in Operation" value={form.yearsInOperation} onChange={(v) => set('yearsInOperation', v)}
                options={['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', 'Over 10 years']}
                placeholder="Select range" required />
            </div>
            <button type="submit" className="w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── Step 1: Contact & Location ── */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-7">
            <div className="grid grid-cols-2 gap-6">
              <FieldInput label="First Name" value={form.contactFirstName} onChange={(v) => set('contactFirstName', v)}
                placeholder="First name" icon={User} required />
              <FieldInput label="Last Name" value={form.contactLastName} onChange={(v) => set('contactLastName', v)}
                placeholder="Last name" icon={User} required />
            </div>
            <FieldInput label="Job Title / Role" value={form.jobTitle} onChange={(v) => set('jobTitle', v)}
              placeholder="Managing Director, Procurement Officer..." required />
            <FieldInput label="Corporate Email" type="email" value={form.email} onChange={(v) => set('email', v)}
              placeholder="name@company.com" icon={Mail} required />
            <FieldInput label="Phone Number" type="tel" value={form.phone} onChange={(v) => set('phone', v)}
              placeholder="+234 800 000 0000" icon={Phone} required />
            <FieldInput label="Business Address" value={form.address} onChange={(v) => set('address', v)}
              placeholder="Street address" icon={MapPin} required />
            <div className="grid grid-cols-2 gap-6">
              <FieldInput label="City" value={form.city} onChange={(v) => set('city', v)} placeholder="City" icon={MapPin} required />
              <FieldSelect label="State" value={form.state} onChange={(v) => set('state', v)}
                options={nigerianStates} placeholder="Select state" required />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(0)}
                className="flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8a29e] border border-[#292524] flex items-center justify-center gap-2 hover:border-[#57534e] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit"
                className="flex-[2] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2: Distribution Capacity ── */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-4">
                States You Intend to Cover <span className="text-[#e5c374]">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {nigerianStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleCoverageState(state)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      form.coverageStates.includes(state)
                        ? 'bg-[#e5c374] text-[#161311]'
                        : 'border border-[#292524] text-[#7e7667] hover:border-[#57534e] hover:text-[#a8a29e]'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
            <FieldSelect label="Expected Monthly Volume" value={form.monthlyVolume} onChange={(v) => set('monthlyVolume', v)}
              options={monthlyVolumes} placeholder="Select volume range" required />
            <div className="grid grid-cols-2 gap-6">
              <FieldSelect label="Do You Have a Warehouse?" value={form.hasWarehouse} onChange={(v) => set('hasWarehouse', v)}
                options={['Yes — owned', 'Yes — leased', 'No — seeking facility']} placeholder="Select" required />
              <FieldInput label="Warehouse Capacity (Tonnes)" value={form.warehouseCapacity}
                onChange={(v) => set('warehouseCapacity', v)} placeholder="e.g. 500" />
            </div>
            <FieldSelect label="Do You Have an Existing Client Network?" value={form.hasExistingClients}
              onChange={(v) => set('hasExistingClients', v)}
              options={['Yes — 50+ clients', 'Yes — 10–50 clients', 'Yes — under 10 clients', 'No — building from scratch']}
              placeholder="Select" required />
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8a29e] border border-[#292524] flex items-center justify-center gap-2 hover:border-[#57534e] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit"
                className="flex-[2] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3: Account Setup ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="p-5 bg-[#1c1917] border border-[#292524]/30 mb-2">
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Portal Login Email</p>
              <p className="text-sm font-bold text-[#e9e1dd]">{form.email || '(set in previous step)'}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-3">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-10 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#57534e] hover:text-[#a8a29e] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-10 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#57534e] hover:text-[#a8a29e] transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => set('agreed', e.target.checked)}
                className="w-4 h-4 mt-0.5 border border-[#4d4540]/40 bg-transparent appearance-none checked:bg-[#e5c374] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-[#a8a29e] leading-relaxed">
                I confirm the business information provided is accurate and I agree to the{' '}
                <Link href="/terms" className="text-[#e5c374] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#e5c374] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8a29e] border border-[#292524] flex items-center justify-center gap-2 hover:border-[#57534e] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-[2] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#161311] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit Application <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-[#292524]/30 flex justify-between items-center">
          <p className="text-[10px] text-[#4d4540]">&copy; {new Date().getFullYear()} Resident Cement Bachi Ltd</p>
          <div className="flex gap-5">
            <Link href="/login" className="text-[10px] text-[#4d4540] hover:text-[#7e7667] transition-colors uppercase tracking-widest">Sign In</Link>
            <Link href="/privacy" className="text-[10px] text-[#4d4540] hover:text-[#7e7667] transition-colors uppercase tracking-widest">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
