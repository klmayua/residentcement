'use client';

import { useState } from 'react';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { User, Building2, Lock, Bell, Globe, Save, Loader2, Eye, EyeOff } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1c1917] border border-[#292524]/30">
      <div className="px-8 py-5 border-b border-[#292524]/30">
        <h3 className="font-headline text-base font-semibold text-[#e9e1dd]">{title}</h3>
      </div>
      <div className="px-8 py-7">{children}</div>
    </div>
  );
}

function SettingField({
  label, value, onChange, type = 'text', placeholder, hint, readOnly,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; readOnly?: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">{label}</label>
      <div className="relative">
        <input
          type={isPassword && !showPw ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full bg-transparent border-0 border-b border-[#4d4540]/40 px-0 ${isPassword ? 'pr-10' : 'pr-0'} py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#57534e] hover:text-[#a8a29e]">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-[10px] text-[#4d4540] mt-1.5">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [company, setCompany] = useState({
    companyName: user?.companyName || '',
    rcNumber: '',
    address: '',
    state: '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    invoiceReminders: true,
    lowStockAlerts: true,
    promotions: false,
  });

  const handleSave = async (section: string) => {
    setSaving(section);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(null);
    setSaved(section);
    setTimeout(() => setSaved(null), 3000);
  };

  const SaveButton = ({ section }: { section: string }) => (
    <button
      type="submit"
      onClick={() => handleSave(section)}
      disabled={!!saving}
      className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
    >
      {saving === section ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : saved === section ? (
        <><Save className="w-3.5 h-3.5" /> Saved</>
      ) : (
        <><Save className="w-3.5 h-3.5" /> Save Changes</>
      )}
    </button>
  );

  return (
    <SidebarLayout title="Settings" subtitle="Account preferences & configuration">
      <div className="max-w-2xl space-y-6">

        {/* Profile */}
        <Section title="Personal Profile">
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <SettingField label="First Name" value={profile.firstName}
                onChange={(v) => setProfile((p) => ({ ...p, firstName: v }))} placeholder="First name" />
              <SettingField label="Last Name" value={profile.lastName}
                onChange={(v) => setProfile((p) => ({ ...p, lastName: v }))} placeholder="Last name" />
            </div>
            <SettingField label="Corporate Email" value={profile.email} readOnly
              hint="Contact support to change your login email." />
            <SettingField label="Phone Number" value={profile.phone} type="tel"
              onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} placeholder="+234 800 000 0000" />
          </div>
          <SaveButton section="profile" />
        </Section>

        {/* Company */}
        <Section title="Company Information">
          <div className="space-y-6 mb-6">
            <SettingField label="Company Name" value={company.companyName}
              onChange={(v) => setCompany((c) => ({ ...c, companyName: v }))} placeholder="Your company" />
            <SettingField label="CAC Registration Number" value={company.rcNumber}
              onChange={(v) => setCompany((c) => ({ ...c, rcNumber: v }))} placeholder="RC-0000000"
              hint="Used for invoice and documentation purposes." />
            <SettingField label="Business Address" value={company.address}
              onChange={(v) => setCompany((c) => ({ ...c, address: v }))} placeholder="Street address" />
          </div>
          <SaveButton section="company" />
        </Section>

        {/* Security */}
        <Section title="Security">
          <div className="space-y-6 mb-6">
            <SettingField label="Current Password" value={security.currentPassword} type="password"
              onChange={(v) => setSecurity((s) => ({ ...s, currentPassword: v }))} placeholder="Enter current password" />
            <SettingField label="New Password" value={security.newPassword} type="password"
              onChange={(v) => setSecurity((s) => ({ ...s, newPassword: v }))} placeholder="Minimum 8 characters" />
            <SettingField label="Confirm New Password" value={security.confirmPassword} type="password"
              onChange={(v) => setSecurity((s) => ({ ...s, confirmPassword: v }))} placeholder="Repeat new password" />
          </div>
          <SaveButton section="security" />
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences">
          <div className="space-y-5 mb-6">
            {([
              { key: 'orderUpdates', label: 'Order Status Updates', hint: 'Email when your order status changes' },
              { key: 'invoiceReminders', label: 'Invoice Reminders', hint: 'Reminders before payment due dates' },
              { key: 'lowStockAlerts', label: 'Low Stock Alerts', hint: 'Alerts when products run low' },
              { key: 'promotions', label: 'Promotional Offers', hint: 'Special pricing and volume discount announcements' },
            ] as const).map(({ key, label, hint }) => (
              <label key={key} className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm text-[#e9e1dd] font-medium">{label}</p>
                  <p className="text-[10px] text-[#57534e] mt-0.5">{hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  className={`relative w-10 h-5 flex-shrink-0 transition-all mt-0.5 ${notifications[key] ? 'bg-[#e5c374]' : 'bg-[#292524]'}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-[#161311] transition-all ${notifications[key] ? 'left-5' : 'left-0.5'}`}
                  />
                </button>
              </label>
            ))}
          </div>
          <SaveButton section="notifications" />
        </Section>

        {/* Danger Zone */}
        <div className="bg-red-950/20 border border-red-900/20 p-7">
          <h3 className="font-headline text-base font-semibold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-[#7e7667] mb-5">
            Permanently deactivate your distributor account. All data, orders, and invoices will be retained for audit purposes but access will be revoked.
          </p>
          <button className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-900/30 hover:bg-red-900/10 transition-colors">
            Request Account Deactivation
          </button>
        </div>

      </div>
    </SidebarLayout>
  );
}
