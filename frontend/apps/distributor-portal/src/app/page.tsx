'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, productsApi, paymentsApi, inventoryApi } from '@/lib/api';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, Wifi, WifiOff, LocalShipping, Receipt, LayoutDashboard, Settings, BarChart3 } from 'lucide-react';
import { useOrderUpdates, useLowStockAlerts, useWebSocketStatus } from '@/lib/websocket';

export default function Dashboard() {
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

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      const response = await inventoryApi.getLowStock();
      return response.data?.data?.slice(0, 2) || [
        { id: '1', product: { name: 'Type-1 Portland' }, availableQuantity: 4200 },
        { id: '2', product: { name: 'Hydraulic Lime' }, availableQuantity: 850 },
      ];
    },
  });

  const { data: invoices } = useQuery({
    queryKey: ['recent-invoices'],
    queryFn: async () => {
      return [
        { id: 'INV-2024-042', client: 'Skyline Plaza Phase II', project: 'Structural Cement (Bulk)', date: 'Oct 12, 2024', amount: 14250, status: 'UNPAID' },
        { id: 'INV-2024-041', client: 'Metro Bridge Renovation', project: 'Reinforced Concrete Mix', date: 'Oct 08, 2024', amount: 8940, status: 'UNPAID' },
        { id: 'INV-2024-039', client: 'Harbor Front Walkway', project: 'Finishing Lime Plaster', date: 'Oct 02, 2024', amount: 2100, status: 'PAID' },
      ];
    },
  });

  const wsStatus = useWebSocketStatus();

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 mb-2">
          <h1 className="font-headline text-xl text-[#e9e1dd] italic tracking-tight">ResidentCement</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e7667] mt-1">Distributor Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#e5c374] bg-[#221f1d] rounded border-l-2 border-[#e5c374] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] rounded transition-colors">
            <Package className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] rounded transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Products
          </Link>
          <Link href="/dashboard/invoices" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] rounded transition-colors">
            <Receipt className="w-5 h-5" />
            Invoices
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917] rounded transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#292524]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-sm">
              JD
            </div>
            <div>
              <p className="text-sm font-bold text-[#e9e1dd]">John Doe</p>
              <p className="text-[10px] text-[#7e7667] uppercase tracking-tight">Senior Distributor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-2 italic">Welcome, John Doe</h2>
            <p className="text-[#a8a29e] max-w-md text-sm">Your logistics oversight for the Northeast region is currently 98% efficient.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* WebSocket Status */}
            <div className="flex items-center gap-2 text-xs">
              {wsStatus === 'connected' ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-[#7e7667]">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-[#57534e]" />
                  <span className="text-[#7e7667]">Offline</span>
                </>
              )}
            </div>
            {/* Gold Gradient Button */}
            <button
              className="px-6 py-3 text-sm font-bold text-[#161311] rounded transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(45deg, #745B17, #e5c374)',
                boxShadow: '0 4px 15px rgba(229, 195, 116, 0.3)'
              }}
            >
              New Distribution Order
            </button>
          </div>
        </header>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-12 gap-6">
          {/* Total Orders Widget */}
          <div className="col-span-12 md:col-span-4 bg-[#1a1c1c] rounded relative overflow-hidden border border-[#292524]/30 group">
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"
              style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
            />
            <div className="p-8">
              <h3 className="font-headline text-[#a8a29e] text-lg mb-6">Total Orders</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-[#e5c374] tracking-tighter">{stats?.orders.toLocaleString() || '1,284'}</span>
                <span className="text-green-500 text-sm font-bold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> 12%
                </span>
              </div>
              <p className="text-[#7e7667] text-xs mt-4 tracking-widest uppercase">Fiscal Year 2024</p>
            </div>
          </div>

          {/* Inventory Status - Circular Progress */}
          <div className="col-span-12 md:col-span-4 bg-[#1a1c1c] rounded border border-[#292524]/30 p-8">
            <h3 className="font-headline text-[#a8a29e] text-lg mb-6">Inventory Status</h3>
            <div className="flex justify-between items-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#292524]" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8" />
                  <circle
                    className="text-[#e5c374]"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="48"
                    stroke="currentColor"
                    strokeDasharray="301.59"
                    strokeDashoffset="45"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#e9e1dd]">85%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[#7e7667] uppercase tracking-widest">Type-1 Portland</p>
                  <p className="text-lg font-bold text-[#e9e1dd]">4,200 Tons</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7e7667] uppercase tracking-widest">Hydraulic Lime</p>
                  <p className="text-lg font-bold text-[#a8a29e]">850 Tons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Shipments */}
          <div className="col-span-12 md:col-span-4 bg-[#1a1c1c] rounded border border-[#292524]/30 p-8">
            <h3 className="font-headline text-[#a8a29e] text-lg mb-6">Recent Shipments</h3>
            <div className="space-y-4">
              {recentOrders?.slice(0, 2).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-[#221f1d] rounded border border-[#292524]/50">
                  <div className="flex items-center gap-3">
                    <LocalShipping className="text-[#e5c374] w-5 h-5" />
                    <div>
                      <p className="text-sm font-bold text-[#e9e1dd]">{order.orderNumber}</p>
                      <p className="text-[10px] text-[#7e7667]">
                        {order.status === 'IN_TRANSIT' ? 'ETA: 2 Hours' : 'Delivered Yesterday'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded border ${
                      order.status === 'IN_TRANSIT'
                        ? 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50'
                        : order.status === 'DELIVERED'
                        ? 'bg-green-900/30 text-green-500 border-green-900/50'
                        : 'bg-stone-800/50 text-stone-400 border-stone-700/50'
                    }`}
                  >
                    {order.status === 'IN_TRANSIT' ? 'In Transit' : order.status === 'DELIVERED' ? 'Delivered' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices - Large Table */}
          <div className="col-span-12 bg-[#1a1c1c] rounded border border-[#292524]/30 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-[#a8a29e] text-xl tracking-tight">Recent Invoices</h3>
                <Link href="/dashboard/invoices" className="text-[#e5c374] text-xs font-bold uppercase tracking-widest border-b border-[#e5c374]/30 pb-1 hover:border-[#e5c374] transition-all">
                  View All Ledger
                </Link>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#292524]">
                      <th className="pb-4 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Invoice ID</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Client / Project</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Issue Date</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Amount</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]/50">
                    {invoices?.map((invoice: any) => (
                      <tr key={invoice.id} className="group hover:bg-[#221f1d]/50 transition-colors">
                        <td className="py-6 text-sm font-bold text-[#e9e1dd]">{invoice.id}</td>
                        <td className="py-6">
                          <div className="text-sm text-[#e9e1dd]">{invoice.client}</div>
                          <div className="text-[10px] text-[#7e7667]">{invoice.project}</div>
                        </td>
                        <td className="py-6 text-sm text-[#a8a29e]">{invoice.date}</td>
                        <td className="py-6 text-sm font-bold text-[#e5c374]">${invoice.amount.toLocaleString()}.00</td>
                        <td className="py-6 text-right">
                          {invoice.status === 'PAID' ? (
                            <>
                              <span className="text-[10px] uppercase font-bold text-[#7e7667] tracking-widest mr-4">Paid</span>
                              <button className="border border-[#57534e] text-[#a8a29e] px-4 py-2 text-xs font-bold rounded hover:bg-[#292524] transition-colors">
                                Receipt
                              </button>
                            </>
                          ) : (
                            <button
                              className="px-4 py-2 text-xs font-bold rounded hover:opacity-90 transition-opacity text-[#161311]"
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
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col md:flex-row justify-between items-center py-8 border-t border-[#292524]/30">
          <div className="text-xs uppercase tracking-widest text-[#7e7667] mb-4 md:mb-0">
            &copy; 2024 Resident Cement. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/dashboard/orders" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#e5c374] transition-colors">Orders</Link>
            <Link href="/dashboard/products" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#e5c374] transition-colors">Products</Link>
            <Link href="/dashboard/invoices" className="text-xs uppercase tracking-widest text-[#7e7667] hover:text-[#e5c374] transition-colors">Invoices</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
