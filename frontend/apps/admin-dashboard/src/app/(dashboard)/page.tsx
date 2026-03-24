'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Factory, Truck, ShoppingCart, Package, Banknote, CheckCircle, PointOfSale, Wrench, Users, Settings, Bell, HelpCircle, History, TrendingUp, BarChart3, Inventory, ShoppingBag } from 'lucide-react';

const sidebarModules = [
  { href: '/dashboard', label: 'Overview', icon: BarChart3, active: true },
  { href: '/dashboard/production', label: 'Production', icon: Factory },
  { href: '/dashboard/logistics', label: 'Logistics', icon: Truck },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/finance', label: 'Finance', icon: Banknote },
  { href: '/dashboard/quality', label: 'Quality', icon: CheckCircle },
  { href: '/dashboard/sales', label: 'Sales', icon: PointOfSale },
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState('month');

  const stats = {
    totalRevenue: 428500000,
    totalOrders: 1248,
    totalCustomers: 856,
    totalProducts: 4,
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="p-6 mb-2">
          <h1 className="font-headline text-xl text-[#e9e1dd] italic tracking-tight">ResidentCement</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e7667] mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sidebarModules.map((module) => (
            <Link key={module.href} href={module.href} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${module.active ? 'text-[#e5c374] bg-[#221f1d] border-l-2 border-[#e5c374]' : 'text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917]'}`}>
              <module.icon className="w-5 h-5" />
              <span className="uppercase tracking-widest text-[10px]">{module.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#292524]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-sm">JD</div>
            <div>
              <p className="text-sm font-bold text-[#e9e1dd]">John Doe</p>
              <p className="text-[10px] text-[#7e7667] uppercase tracking-tight">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="h-20 px-8 flex justify-between items-center border-b border-[#292524]/50 sticky top-0 bg-[#161311]/95 backdrop-blur-md z-30">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-headline font-bold tracking-tight text-[#e9e1dd]">Admin Dashboard</span>
            <span className="text-[#e5c374] text-sm font-medium border-b border-[#e5c374] pb-1">Status: Operational</span>
          </div>
          <div className="flex items-center gap-6">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-[#1a1c1c] text-[#e9e1dd] text-sm px-4 py-2 border border-[#292524]/50 rounded focus:outline-none focus:border-[#e5c374]">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="text-[#a8a29e] hover:text-[#e9e1dd] transition-colors"><Settings className="w-5 h-5" /></button>
            <button className="text-[#a8a29e] hover:text-[#e9e1dd] transition-colors"><Bell className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tight text-[#e9e1dd] mb-4">Architectural Gravitas.</h2>
            <p className="text-[#a8a29e] text-sm uppercase tracking-widest">Enterprise Resource Planning & Command Center</p>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-12 gap-6 mb-12">
            {/* Main KPI */}
            <div className="col-span-12 lg:col-span-8 bg-[#1a1c1c] rounded border border-[#292524]/30 p-10 flex flex-col justify-between min-h-[300px]">
              <div>
                <Factory className="text-[#e5c374] w-12 h-12 mb-6" />
                <h3 className="text-3xl font-headline text-[#e9e1dd] mb-2">Production Pace</h3>
                <p className="text-[#a8a29e] text-sm max-w-md">Real-time aggregate output across all integrated kilns and grinding units.</p>
              </div>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-7xl font-headline font-bold text-[#e5c374]">10</span>
                <span className="text-2xl text-[#a8a29e]">Mt</span>
                <span className="text-green-500 flex items-center gap-1 text-sm ml-4"><TrendingUp className="w-4 h-4" />+4.2%</span>
              </div>
            </div>

            {/* Finance KPI */}
            <div className="col-span-12 lg:col-span-4 bg-[#221f1d] rounded border border-[#292524]/30 p-8 flex flex-col justify-between">
              <div>
                <Banknote className="text-[#e5c374] w-10 h-10 mb-6" />
                <h3 className="text-2xl font-headline font-bold text-[#e9e1dd]">Finance Volume</h3>
              </div>
              <div className="mt-8">
                <span className="text-3xl font-headline font-bold block text-[#e9e1dd]">{formatCurrency(stats.totalRevenue)}</span>
                <p className="text-[#7e7667] text-xs uppercase tracking-widest mt-2">Total Revenue {period}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-[#292524]">
                <Link href="/dashboard/finance" className="w-full py-3 text-xs font-bold uppercase tracking-widest text-[#161311] bg-[#e5c374] rounded hover:opacity-90 transition-opacity block text-center">Audit Ledger</Link>
              </div>
            </div>

            {/* Bottom KPIs */}
            <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-[#745b17] to-[#c5a55a] p-10 rounded text-[#161311]">
              <CheckCircle className="w-10 h-10 mb-4" />
              <h3 className="font-headline text-xl mb-1">Safety Record</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-headline font-black">428</span>
                <span className="text-sm uppercase">Days</span>
              </div>
              <p className="text-xs uppercase tracking-widest mt-2 opacity-80">Since Last LTI</p>
            </div>

            <div className="col-span-12 md:col-span-4 bg-[#1a1c1c] rounded border border-[#292524]/30 p-10">
              <ShoppingCart className="text-[#e5c374] w-10 h-10 mb-4" />
              <h3 className="font-headline text-xl mb-1 text-[#e9e1dd]">Active Orders</h3>
              <div className="text-6xl font-headline font-bold text-[#e9e1dd]">{stats.totalOrders}</div>
              <p className="text-[#7e7667] text-xs uppercase tracking-widest mt-2">Total Orders This {period}</p>
            </div>

            <div className="col-span-12 md:col-span-4 bg-[#1a1c1c] rounded border border-[#292524]/30 p-10">
              <Users className="text-[#e5c374] w-10 h-10 mb-4" />
              <h3 className="font-headline text-xl mb-1 text-[#e9e1dd]">Active Customers</h3>
              <div className="text-6xl font-headline font-bold text-[#e9e1dd]">{stats.totalCustomers}</div>
              <p className="text-[#7e7667] text-xs uppercase tracking-widest mt-2">Total Registered Accounts</p>
            </div>
          </div>

          {/* Secondary Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Operational Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Inventory', icon: Inventory, title: 'Clinker Reserves', value: '842,000 Tons', percent: '82%' },
                { label: 'Quality', icon: CheckCircle, title: 'Batch Pass Rate', value: '99.4%', sub: 'Exceeding NIS standards' },
                { label: 'Maintenance', icon: Wrench, title: 'Kiln Availability', value: '98.2%', tags: ['K1: Active', 'K2: Active'] },
                { label: 'Procurement', icon: ShoppingBag, title: 'Active POs', value: '142', sub: 'Total: $1.24B' },
              ].map((item) => (
                <div key={item.title} className="bg-[#1a1c1c] p-6 rounded border border-[#292524]/30 border-l-2 border-l-[#e5c374]">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#e5c374]">{item.label}</span>
                    <item.icon className="text-[#7e7667] w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-lg mb-2 text-[#e9e1dd]">{item.title}</h4>
                  <div className="text-2xl font-headline font-bold text-[#e9e1dd]">{item.value}</div>
                  {item.percent && (
                    <div className="mt-3">
                      <div className="w-full bg-[#292524] h-1 rounded"><div className="bg-[#e5c374] h-full rounded" style={{ width: item.percent }} /></div>
                      <div className="flex justify-between text-xs text-[#7e7667] mt-1"><span>Capacity</span><span className="text-[#e5c374]">{item.percent}</span></div>
                    </div>
                  )}
                  {item.sub && <p className="text-xs text-[#7e7667] mt-2">{item.sub}</p>}
                  {item.tags && (
                    <div className="flex gap-2 mt-3">
                      {item.tags.map((tag) => <span key={tag} className="px-2 py-1 bg-[#292524] text-[#e5c374] text-[10px] uppercase rounded">{tag}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline text-2xl text-[#e9e1dd]">Recent Orders</h4>
                <Link href="/dashboard/orders" className="text-[#e5c374] text-xs uppercase tracking-widest hover:underline">View All →</Link>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#292524]">
                    <th className="text-left text-[10px] uppercase tracking-widest text-[#7e7667] font-medium pb-4">Order</th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-[#7e7667] font-medium pb-4">Customer</th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-[#7e7667] font-medium pb-4">Total</th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-[#7e7667] font-medium pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292524]/50">
                  {[
                    { id: 'ORD-001', customer: 'Skyline Construction', total: 450000, status: 'completed' },
                    { id: 'ORD-002', customer: 'Metro Builders', total: 210000, status: 'processing' },
                    { id: 'ORD-003', customer: 'ABC Supplies', total: 900000, status: 'pending' },
                    { id: 'ORD-004', customer: 'Harbor Front', total: 307500, status: 'completed' },
                  ].map((order) => (
                    <tr key={order.id} className="hover:bg-[#221f1d]/50">
                      <td className="py-4 text-sm font-medium text-[#e5c374]">{order.id}</td>
                      <td className="py-4 text-sm text-[#e9e1dd]">{order.customer}</td>
                      <td className="py-4 text-sm font-bold text-[#e9e1dd]">{formatCurrency(order.total)}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-[10px] uppercase rounded ${order.status === 'completed' ? 'bg-green-900/30 text-green-500 border border-green-900/50' : order.status === 'processing' ? 'bg-[#e5c374]/20 text-[#e5c374] border border-[#e5c374]/30' : 'bg-yellow-900/30 text-yellow-500 border border-yellow-900/50'}`}>
                          {order.status}
                        </span>
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
