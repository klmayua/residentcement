'use client';

import { useState } from 'react';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { useAuth } from '@/components/providers/auth-provider';
import { User, Building2, Bell, Shield, Users, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'team', label: 'Team Members', icon: Users },
  ];

  return (
    <SidebarLayout title="Settings" subtitle="Manage your account preferences">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-[#1c1917] border border-[#292524]/30 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'text-[#e5c374] bg-[#221f1d]'
                      : 'text-[#57534e] hover:text-[#a8a29e] hover:bg-[#1c1917]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {saved && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span>Settings saved successfully</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
              <h2 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Profile Information</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-[#e5c374] flex items-center justify-center text-[#161311] text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <button className="btn-ghost text-[10px]">Change Avatar</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue={user?.firstName}
                      className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user?.lastName}
                      className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+234 800 000 0000"
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button onClick={handleSave} className="btn-gold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
              <h2 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Company Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue={user?.companyName || 'Your Company Ltd'}
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Business Registration Number</label>
                  <input
                    type="text"
                    defaultValue="RC123456789"
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Tax ID</label>
                  <input
                    type="text"
                    defaultValue="TIN-12345678-0001"
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Business Address</label>
                  <textarea
                    rows={3}
                    defaultValue="123 Business Street, Lagos, Nigeria"
                    className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button onClick={handleSave} className="btn-gold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
              <h2 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { id: 'orders', label: 'Order Updates', desc: 'Receive notifications when order status changes' },
                  { id: 'invoices', label: 'Invoice Reminders', desc: 'Get notified about upcoming and overdue invoices' },
                  { id: 'shipments', label: 'Shipment Updates', desc: 'Track your deliveries in real-time' },
                  { id: 'promotions', label: 'Promotions & Offers', desc: 'Receive special pricing and promotional offers' },
                  { id: 'stock', label: 'Stock Alerts', desc: 'Get notified when products are back in stock' },
                ].map((item) => (
                  <label key={item.id} className="flex items-start gap-3 pb-4 border-b border-[#292524]/30 last:border-0 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 w-4 h-4 border border-[#4d4540] bg-transparent appearance-none checked:bg-[#e5c374] checked:border-[#e5c374] cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#e9e1dd]">{item.label}</p>
                      <p className="text-xs text-[#57534e]">{item.desc}</p>
                    </div>
                  </label>
                ))}

                <div className="pt-4">
                  <button onClick={handleSave} className="btn-gold">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
              <h2 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[#e9e1dd] mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#57534e] mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#221f1d] border border-[#292524] px-4 py-3 text-[#e9e1dd] text-sm focus:outline-none focus:border-[#e5c374] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#292524]/30">
                  <h3 className="text-sm font-medium text-[#e9e1dd] mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#e9e1dd]">Enable 2FA</p>
                      <p className="text-xs text-[#57534e]">Add an extra layer of security</p>
                    </div>
                    <button className="btn-ghost text-[10px]">Enable</button>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleSave} className="btn-gold">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-[#1c1917] border border-[#292524]/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-lg font-semibold text-[#e9e1dd]">Team Members</h2>
                <button className="btn-gold text-[10px] py-2 px-4">+ Add Member</button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
                  { name: 'Sarah Smith', email: 'sarah@company.com', role: 'Procurement', status: 'Active' },
                  { name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', status: 'Pending' },
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#221f1d] border border-[#292524]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e5c374]/10 flex items-center justify-center text-[#e5c374] font-bold text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e9e1dd]">{member.name}</p>
                        <p className="text-xs text-[#57534e]">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#57534e]">{member.role}</span>
                      <span className={`text-xs px-2 py-1 ${
                        member.status === 'Active'
                          ? 'bg-green-900/20 text-green-500'
                          : 'bg-amber-900/20 text-amber-500'
                      }`}>
                        {member.status}
                      </span>
                      <button className="text-[10px] text-[#57534e] hover:text-[#e5c374] transition-colors">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
