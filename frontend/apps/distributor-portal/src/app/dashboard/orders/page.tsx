'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { Plus, Search, Filter, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Pending',    color: 'text-[#a8a29e] bg-[#292524]',           icon: Clock },
  CONFIRMED:  { label: 'Confirmed',  color: 'text-blue-400 bg-blue-950/30',           icon: CheckCircle },
  IN_TRANSIT: { label: 'In Transit', color: 'text-amber-400 bg-amber-950/30',         icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: 'text-green-400 bg-green-950/30',         icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-400 bg-red-950/30',             icon: XCircle },
};

const MOCK_ORDERS = [
  { id: '1', orderNumber: '#RC-9021', customer: { name: 'Skyline Construction Ltd' }, items: [{ product: { name: 'Type-1 Portland Cement' }, quantity: 200 }], status: 'IN_TRANSIT', total: 142500, createdAt: '2025-03-24' },
  { id: '2', orderNumber: '#RC-8994', customer: { name: 'Metro Developers' }, items: [{ product: { name: 'Hydraulic Lime' }, quantity: 80 }], status: 'DELIVERED', total: 89400, createdAt: '2025-03-20' },
  { id: '3', orderNumber: '#RC-8980', customer: { name: 'Harbor Front Ltd' }, items: [{ product: { name: 'Type-1 Portland Cement' }, quantity: 60 }], status: 'PENDING', total: 56200, createdAt: '2025-03-18' },
  { id: '4', orderNumber: '#RC-8961', customer: { name: 'Apex Constructions' }, items: [{ product: { name: 'Rapid-Set Cement' }, quantity: 150 }], status: 'CONFIRMED', total: 210000, createdAt: '2025-03-15' },
  { id: '5', orderNumber: '#RC-8940', customer: { name: 'Greenfield Estates' }, items: [{ product: { name: 'Type-1 Portland Cement' }, quantity: 40 }], status: 'CANCELLED', total: 34000, createdAt: '2025-03-10' },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await ordersApi.list({ limit: 50 });
      return res.data?.data || MOCK_ORDERS;
    },
  });

  const filtered = (orders || MOCK_ORDERS).filter((o: any) => {
    const matchesSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarLayout title="Orders" subtitle="Manage your distribution orders">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2.5 bg-[#1c1917] border border-[#292524]/40 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-[#e5c374]/40 transition-colors w-64"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#1c1917] border border-[#292524]/40 text-[#a8a29e] text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#e5c374]/40 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <Link
            href="/dashboard/orders/new"
            className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#161311] hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(45deg, #745B17, #e5c374)' }}
          >
            <Plus className="w-4 h-4" /> New Order
          </Link>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#292524]/20 mb-8">
        {(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] as const).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const count = (orders || MOCK_ORDERS).filter((o: any) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'ALL' : status)}
              className={`bg-[#1c1917] p-6 text-left transition-colors hover:bg-[#221f1d] ${statusFilter === status ? 'ring-1 ring-inset ring-[#e5c374]/20' : ''}`}
            >
              <p className="text-[10px] uppercase tracking-widest text-[#57534e] mb-2">{cfg.label}</p>
              <p className="text-3xl font-headline font-bold text-[#e9e1dd]">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-[#1c1917] border border-[#292524]/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#292524]/30">
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Order</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Customer / Product</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Date</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Amount</th>
              <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Status</th>
              <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: any) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = cfg.icon;
              return (
                <tr key={order.id} className="border-b border-[#292524]/20 hover:bg-[#221f1d]/40 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-[#e9e1dd]">{order.orderNumber}</td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[#e9e1dd]">{order.customer?.name}</div>
                    <div className="text-[10px] text-[#57534e] mt-0.5">
                      {order.items?.[0]?.product?.name} {order.items?.[0]?.quantity ? `· ${order.items[0].quantity} tonnes` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#a8a29e]">{order.createdAt?.slice(0, 10) ?? '—'}</td>
                  <td className="px-6 py-5 text-sm font-bold text-[#e5c374]">₦{order.total?.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <Package className="w-10 h-10 text-[#292524] mx-auto mb-4" />
                  <p className="text-[#57534e] text-sm">No orders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
