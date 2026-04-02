'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import {
  Package, Search, Download, Eye, Truck, CheckCircle, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';

const orders = [
  { id: 'B2B-2025-089', customer: 'Atlantic Construction Ltd', status: 'IN_TRANSIT', total: 2850000, date: '2025-03-28', items: 500 },
  { id: 'B2B-2025-088', customer: 'Highland Developers', status: 'CONFIRMED', total: 1425000, date: '2025-03-27', items: 250 },
  { id: 'B2B-2025-087', customer: 'Metro Builders Inc', status: 'DELIVERED', total: 3200000, date: '2025-03-25', items: 600 },
  { id: 'B2B-2025-086', customer: 'Summit Contractors', status: 'DELIVERED', total: 2280000, date: '2025-03-22', items: 400 },
  { id: 'B2B-2025-085', customer: 'Unity Construction', status: 'PROCESSING', total: 1890000, date: '2025-03-20', items: 300 },
  { id: 'B2B-2025-084', customer: 'Pinnacle Developers', status: 'PENDING', total: 4560000, date: '2025-03-18', items: 800 },
  { id: 'B2B-2025-083', customer: 'Elite Builders', status: 'CANCELLED', total: 1250000, date: '2025-03-15', items: 200 },
  { id: 'B2B-2025-082', customer: 'Prime Construction', status: 'DELIVERED', total: 3420000, date: '2025-03-12', items: 600 },
];

const statusConfig: Record<string, { color: string; label: string; icon: typeof Clock }> = {
  PENDING: { color: 'bg-[#292524] text-[#a8a29e]', label: 'Pending', icon: Clock },
  CONFIRMED: { color: 'bg-blue-900/20 text-blue-500', label: 'Confirmed', icon: CheckCircle },
  PROCESSING: { color: 'bg-amber-900/20 text-amber-500', label: 'Processing', icon: Clock },
  IN_TRANSIT: { color: 'bg-purple-900/20 text-purple-500', label: 'In Transit', icon: Truck },
  DELIVERED: { color: 'bg-green-900/20 text-green-500', label: 'Delivered', icon: CheckCircle },
  CANCELLED: { color: 'bg-red-900/20 text-red-500', label: 'Cancelled', icon: Clock },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SidebarLayout title="Orders" subtitle="Manage your B2B orders">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534e]" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#4d4540]/40 pl-8 pr-4 py-3 text-[#e9e1dd] text-sm placeholder:text-[#4d4540] focus:outline-none focus:border-b-2 focus:border-[#e5c374] transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1c1917] border border-[#292524] text-[#a8a29e] text-sm px-4 py-3 focus:outline-none focus:border-[#e5c374]"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="btn-ghost flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1c1917] border border-[#292524]/30 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#292524]/30">
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Order ID</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Customer</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Date</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Items</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Total</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Status</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292524]/10">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-[#221f1d]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#e9e1dd]">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#a8a29e]">{order.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#57534e]">{formatDate(order.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#a8a29e]">{order.items} bags</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#e5c374]">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <button className="p-2 text-[#57534e] hover:text-[#e5c374] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#57534e]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#292524] text-[#57534e] hover:text-[#e9e1dd] hover:border-[#e5c374] transition-colors" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-[#a8a29e]">Page 1 of 1</span>
            <button className="p-2 border border-[#292524] text-[#57534e] hover:text-[#e9e1dd] hover:border-[#e5c374] transition-colors" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
