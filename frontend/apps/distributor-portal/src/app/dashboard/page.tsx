'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, productsApi, paymentsApi, inventoryApi } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { Package, ShoppingCart, TrendingUp, Wifi, WifiOff, Truck, Receipt, LayoutDashboard, Settings, BarChart3, LogOut, Bell } from 'lucide-react';
import { useOrderUpdates, useLowStockAlerts, useWebSocketStatus } from '@/lib/websocket';

function DashboardContent() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'RC'
    : 'RC';

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Dealer';
  const company = user?.companyName ?? 'Distribution Partner';

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [orders, products, payments] = await Promise.all([
        ordersApi.list({ limit: 1 }),
        productsApi.list({ limit: 1 }),
        paymentsApi.list({ limit: 1 }),
      ]);
      return {
        orders: orders.data?.meta?.pagination?.total || 1284,
        products: products.data?.meta?.pagination?.total || 42,
        revenue: (payments.data?.meta?.pagination?.total || 145) * 10000,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await ordersApi.list({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' });
      return response.data?.data || [
        { id: '1', orderNumber: '#RC-9021', customer: { name: 'Skyline Construction' }, status: 'IN_TRANSIT', total: 142500 },
        { id: '2', orderNumber: '#RC-8994', customer: { name: 'Metro Developers' }, status: 'DELIVERED', total: 89400 },
        { id: '3', orderNumber: '#RC-8980', customer: { name: 'Harbor Front Ltd' }, status: 'PENDING', total: 56200 },
      ];
    },
  });

  const { data: invoices } = useQuery({
    queryKey: ['recent-invoices'],
    queryFn: async () => {
      return [
        { id: 'INV-2025-042', client: 'Skyline Plaza Phase II', project: 'Structural Cement (Bulk)', date: 'Mar 12, 2025', amount: 14250, status: 'UNPAID' },
        { id: 'INV-2025-041', client: 'Metro Bridge Renovation', project: 'Reinforced Concrete Mix', date: 'Mar 08, 2025', amount: 8940, status: 'UNPAID' },
        { id: 'INV-2025-039', client: 'Harbor Front Walkway', project: 'Finishing Lime Plaster', date: 'Mar 02, 2025', amount: 2100, status: 'PAID' },
      ];
    },
  });

  const wsStatus = useWebSocketStatus();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { href: '/dashboard/orders', label: 'Orders', icon: Package },
    { href: '/dashboard/products', label: 'Products', icon: ShoppingCart },
    { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="px-6 h-16 flex items-center border-b border-[#292524]/30">
          <div>
            <span className="font-headline text-base text-[#e9e1dd] tracking-tight">
              Resident<span className="text-[#e5c374]">Cement</span>
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#57534e] mt-0.5">Dealer Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                item.active
                  ? 'text-[#e5c374] bg-[#221f1d] border-l-2 border-[#e5c374]'
                  : 'text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] border-l-2 border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#292524]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-xs flex-shrink-0">
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

      {/* ── Main Content ── */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-[#292524]/30 flex items-center justify-between px-8 sticky top-0 bg-[#161311]/90 backdrop-blur-xl z-30">
          <div>
            <h2 className="font-headline text-xl font-bold text-[#e9e1dd] tracking-tight">
              Welcome back, <span className="text-[#e5c374]">{user?.firstName ?? 'Partner'}</span>
            </h2>
            <p className="text-[10px] text-[#57534e] uppercase tracking-widest">Northeast Region · {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest">
              {wsStatus === 'connected' ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-[#57534e]">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-[#57534e]" />
                  <span className="text-[#57534e]">Offline</span>
                </>
              )}
            </div>
            <button className="relative p-2 text-[#57534e] hover:text-[#a8a29e] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e5c374]" />
            </button>
            <Link
              href="/dashboard/orders/new"
              className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#161311] rounded transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
            >
              New Order
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Total Orders */}
            <div className="col-span-12 md:col-span-4 bg-[#1c1917] border border-[#292524]/30 p-7 relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"
                style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
              />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7e7667] mb-4">Total Orders</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-headline font-bold text-[#e5c374]">
                  {stats?.orders.toLocaleString() ?? '1,284'}
                </span>
                <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 12%
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#57534e]">Fiscal Year 2025</p>
            </div>

            {/* Inventory Status */}
            <div className="col-span-12 md:col-span-4 bg-[#1c1917] border border-[#292524]/30 p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7e7667] mb-6">Inventory Status</p>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#292524" strokeWidth="4" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#e5c374" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 22 * 0.85} ${2 * Math.PI * 22 * 0.15}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#e9e1dd]">85%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-[#57534e] uppercase tracking-widest">Type-1 Portland</p>
                    <p className="text-base font-bold text-[#e9e1dd]">4,200 Tons</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#57534e] uppercase tracking-widest">Hydraulic Lime</p>
                    <p className="text-base font-bold text-[#a8a29e]">850 Tons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="col-span-12 md:col-span-4 bg-[#1c1917] border border-[#292524]/30 p-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7e7667] mb-6">Recent Shipments</p>
              <div className="space-y-3">
                {(recentOrders ?? []).slice(0, 2).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#221f1d] border border-[#292524]/30 rounded">
                    <div className="flex items-center gap-3">
                      <Truck className="text-[#e5c374] w-4 h-4 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#e9e1dd]">{order.orderNumber}</p>
                        <p className="text-[10px] text-[#57534e]">
                          {order.status === 'IN_TRANSIT' ? 'ETA: 2 Hours' : 'Delivered'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded ${
                        order.status === 'IN_TRANSIT'
                          ? 'bg-amber-900/20 text-amber-500'
                          : order.status === 'DELIVERED'
                          ? 'bg-green-900/20 text-green-500'
                          : 'bg-[#292524] text-[#a8a29e]'
                      }`}
                    >
                      {order.status === 'IN_TRANSIT' ? 'In Transit' : order.status === 'DELIVERED' ? 'Delivered' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Invoices Table ── */}
          <div className="bg-[#1c1917] border border-[#292524]/30">
            <div className="px-8 py-6 border-b border-[#292524]/30 flex justify-between items-center">
              <div>
                <h3 className="font-headline text-lg font-semibold text-[#e9e1dd]">Recent Invoices</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#57534e] mt-1">Outstanding & recent payments</p>
              </div>
              <Link
                href="/dashboard/invoices"
                className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] border-b border-[#e5c374]/30 pb-0.5 hover:border-[#e5c374] transition-all"
              >
                View All Ledger →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#292524]/30">
                    <th className="px-8 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Invoice ID</th>
                    <th className="px-8 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Client / Project</th>
                    <th className="px-8 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Date</th>
                    <th className="px-8 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Amount</th>
                    <th className="px-8 py-4 text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoices ?? []).map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-[#292524]/20 hover:bg-[#221f1d]/40 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-[#e9e1dd]">{invoice.id}</td>
                      <td className="px-8 py-5">
                        <div className="text-sm text-[#e9e1dd]">{invoice.client}</div>
                        <div className="text-[10px] text-[#57534e] mt-0.5">{invoice.project}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-[#a8a29e]">{invoice.date}</td>
                      <td className="px-8 py-5 text-sm font-bold text-[#e5c374]">
                        ₦{invoice.amount.toLocaleString()}.00
                      </td>
                      <td className="px-8 py-5 text-right">
                        {invoice.status === 'PAID' ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Paid</span>
                        ) : (
                          <button
                            className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity text-[#161311]"
                            style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
