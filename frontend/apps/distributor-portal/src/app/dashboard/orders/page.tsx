'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, MoreVertical, Clock, CheckCircle, Truck, XCircle, Filter, Package, LayoutDashboard, ShoppingCart, BarChart3, Receipt, Settings, LocalShipping } from 'lucide-react';

const orders = [
  { id: 'ORD-001', date: '2026-03-05', customer: 'Doe Cement Distributors', items: '100 bags Resident 42.5R', total: 450000, status: 'delivered', paymentStatus: 'paid' },
  { id: 'ORD-002', date: '2026-03-04', customer: 'BuildRight Construction', items: '50 bags Resident 32.5R', total: 210000, status: 'in_transit', paymentStatus: 'paid' },
  { id: 'ORD-003', date: '2026-03-03', customer: 'ABC Supplies Ltd', items: '200 bags Resident 42.5R', total: 900000, status: 'pending', paymentStatus: 'pending' },
  { id: 'ORD-004', date: '2026-03-02', customer: 'Metro Builders', items: '75 bags Pozzolana 32.5N', total: 307500, status: 'delivered', paymentStatus: 'paid' },
  { id: 'ORD-005', date: '2026-03-01', customer: 'Gold Coast Motors', items: '150 bags Resident 52.5R', total: 780000, status: 'cancelled', paymentStatus: 'refunded' },
];

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, active: true },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50',
    in_transit: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
    delivered: 'bg-green-900/30 text-green-500 border-green-900/50',
    cancelled: 'bg-red-900/30 text-red-400 border-red-900/50',
  };
  const labels = { pending: 'Pending', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const styles = {
    paid: 'bg-green-900/30 text-green-500 border-green-900/50',
    pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50',
    refunded: 'bg-stone-800/50 text-stone-400 border-stone-700/50',
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#161311] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161311] border-r border-[#292524]/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="p-6 mb-2">
          <h1 className="font-headline text-xl text-[#e9e1dd] italic tracking-tight">ResidentCement</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e7667] mt-1">Distributor Portal</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${link.active ? 'text-[#e5c374] bg-[#221f1d] border-l-2 border-[#e5c374]' : 'text-[#a8a29e] hover:text-[#e9e1dd] hover:bg-[#1c1917]'}`}>
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#292524]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#e5c374] flex items-center justify-center text-[#161311] font-bold text-sm">JD</div>
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
            <h2 className="font-headline text-4xl font-bold text-[#e9e1dd] mb-2 italic">Orders</h2>
            <p className="text-[#a8a29e] max-w-md text-sm">Manage and track your cement distribution orders</p>
          </div>
          <Link href="/dashboard/orders/new">
            <button className="px-6 py-3 text-sm font-bold text-[#161311] rounded transition-all hover:opacity-90" style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)', boxShadow: '0 4px 15px rgba(229, 195, 116, 0.3)' }}>
              <Plus className="w-4 h-4 inline mr-2" /> New Order
            </button>
          </Link>
        </header>

        {/* Filters */}
        <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7e7667]" />
              <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-0 border-b border-[#4d4540]/30 pl-10 pr-4 py-3 text-[#e9e1dd] placeholder:text-[#7e7667]/50 focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all" />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in_transit', 'delivered'].map((filter) => (
                <button key={filter} onClick={() => setStatusFilter(filter)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${statusFilter === filter ? 'bg-[#e5c374] text-[#161311] border-[#e5c374]' : 'bg-transparent text-[#a8a29e] border-[#4d4540]/30 hover:border-[#e5c374]/50'}`}>
                  {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1a1c1c] rounded border border-[#292524]/30 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#292524]">
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Order ID</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Date</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Customer</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Items</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Total</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Status</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium">Payment</th>
                  <th className="pb-4 pt-6 px-6 text-[10px] uppercase tracking-widest text-[#7e7667] font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-[#221f1d]/50 transition-colors">
                    <td className="py-6 px-6 text-sm font-bold text-[#e9e1dd]">{order.id}</td>
                    <td className="py-6 px-6 text-sm text-[#a8a29e]">{order.date}</td>
                    <td className="py-6 px-6 text-sm text-[#e9e1dd]">{order.customer}</td>
                    <td className="py-6 px-6 text-sm text-[#a8a29e]">{order.items}</td>
                    <td className="py-6 px-6 text-sm font-bold text-[#e5c374]">{formatCurrency(order.total)}</td>
                    <td className="py-6 px-6"><StatusBadge status={order.status} /></td>
                    <td className="py-6 px-6"><PaymentBadge status={order.paymentStatus} /></td>
                    <td className="py-6 px-6 text-right">
                      <button className="text-[#7e7667] hover:text-[#e5c374] transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-[#292524]/50 flex justify-between items-center">
            <span className="text-xs text-[#7e7667]">Showing {filteredOrders.length} orders</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#4d4540]/30 text-[#a8a29e] hover:border-[#e5c374]/50 transition-colors">Previous</button>
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#4d4540]/30 text-[#a8a29e] hover:border-[#e5c374]/50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
