'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { LayoutDashboard, Package, ShoppingCart, Receipt, BarChart3, Settings, LogOut, Bell, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: Package },
  { href: '/dashboard/products', label: 'Products', icon: ShoppingCart },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function SidebarLayoutContent({ children, title, subtitle }: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'RC'
    : 'RC';
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Partner';
  const company = user?.companyName ?? 'Distribution Partner';

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 h-16 flex items-center justify-between border-b border-[#292524]/30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-36 flex-shrink-0" style={{ background: '#e5c374', WebkitMaskImage: "url('/images/logo.png')", maskImage: "url('/images/logo.png')", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "left center", maskPosition: "left center" }} role="img" aria-label="Resident Ciment" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#4d4540] border-l border-[#292524] pl-3 whitespace-nowrap">Dealer Portal</span>
          </div>
          <button
            className="lg:hidden p-1.5 text-[#57534e] hover:text-[#a8a29e] flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'text-[#e5c374] bg-[#221f1d] border-l-2 border-[#e5c374]'
                    : 'text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] border-l-2 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#292524]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#e9e1dd] truncate">{displayName}</p>
              <p className="text-[10px] text-[#57534e] uppercase tracking-tight truncate">{company}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#a8a29e] hover:bg-[#1c1917] rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="h-16 border-b border-[#292524]/30 flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[#161311]/90 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-[#57534e] hover:text-[#a8a29e] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {title && <h2 className="font-headline text-lg md:text-xl font-bold text-[#e9e1dd] tracking-tight">{title}</h2>}
              {subtitle && <p className="text-[10px] text-[#57534e] uppercase tracking-widest hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[#57534e] hover:text-[#a8a29e] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e5c374]" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export function SidebarLayout({ children, title, subtitle }: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <ProtectedRoute>
      <SidebarLayoutContent title={title} subtitle={subtitle}>{children}</SidebarLayoutContent>
    </ProtectedRoute>
  );
}

