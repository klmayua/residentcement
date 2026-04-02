'use client';

import Link from 'next/link';
import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import {
  Package, TrendingUp, Truck, Receipt, CreditCard, Building2,
  ArrowRight
} from 'lucide-react';

function DashboardContent() {
  const stats = [
    {
      title: 'Total Orders',
      value: '47',
      change: '+18%',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Active Invoices',
      value: '23',
      change: '5 Unpaid',
      icon: Receipt,
      trend: 'neutral',
    },
    {
      title: 'Credit Available',
      value: '₦3,750,000',
      change: 'Limit: ₦5,000,000',
      icon: CreditCard,
      trend: 'neutral',
    },
    {
      title: 'Products',
      value: '12',
      change: '8 In Stock',
      icon: Building2,
      trend: 'neutral',
    },
  ];

  const recentOrders = [
    { id: 'B2B-2025-089', customer: 'Atlantic Construction Ltd', status: 'IN_TRANSIT', total: 2850000, date: 'Mar 28' },
    { id: 'B2B-2025-088', customer: 'Highland Developers', status: 'CONFIRMED', total: 1425000, date: 'Mar 27' },
    { id: 'B2B-2025-087', customer: 'Metro Builders Inc', status: 'DELIVERED', total: 3200000, date: 'Mar 25' },
    { id: 'B2B-2025-086', customer: 'Summit Contractors', status: 'DELIVERED', total: 2280000, date: 'Mar 22' },
  ];

  const invoices = [
    { id: 'INV-B2B-025', client: 'Atlantic Construction Ltd', amount: 2850000, dueDate: 'Apr 27' },
    { id: 'INV-B2B-024', client: 'Highland Developers', amount: 1425000, dueDate: 'Apr 26' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-900/20 text-green-500';
      case 'IN_TRANSIT':
        return 'bg-amber-900/20 text-amber-500';
      case 'CONFIRMED':
        return 'bg-blue-900/20 text-blue-500';
      default:
        return 'bg-[#292524] text-[#a8a29e]';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <SidebarLayout title="Welcome back" subtitle="Enterprise Procurement Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#1c1917] border border-[#292524]/30 p-6 relative overflow-hidden group hover:border-[#e5c374]/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#57534e] mb-2">{stat.title}</p>
                  <p className="text-2xl font-headline font-bold text-[#e5c374]">{stat.value}</p>
                </div>
                <div className="p-2 bg-[#e5c374]/10">
                  <stat.icon className="w-5 h-5 text-[#e5c374]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {stat.trend === 'up' && (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">{stat.change}</span>
                  </>
                )}
                {stat.trend === 'neutral' && (
                  <span className="text-xs text-[#57534e]">{stat.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-[#1c1917] border border-[#292524]/30">
            <div className="px-6 py-4 border-b border-[#292524]/30 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-lg font-semibold text-[#e9e1dd]">Recent Orders</h3>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mt-1">Last 4 orders</p>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#292524]/10">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#221f1d]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#292524]/30">
                      <Truck className="w-4 h-4 text-[#e5c374]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e9e1dd]">{order.id}</p>
                      <p className="text-[10px] text-[#57534e]">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#e5c374]">{formatCurrency(order.total)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="bg-[#1c1917] border border-[#292524]/30">
            <div className="px-6 py-4 border-b border-[#292524]/30 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-lg font-semibold text-[#e9e1dd]">Pending Invoices</h3>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mt-1">Outstanding payments</p>
              </div>
              <Link
                href="/dashboard/invoices"
                className="text-[10px] font-bold uppercase tracking-widest text-[#e5c374] hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-[#292524]/10">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#221f1d]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#292524]/30">
                      <Receipt className="w-4 h-4 text-[#e5c374]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e9e1dd]">{invoice.id}</p>
                      <p className="text-[10px] text-[#57534e]">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#e5c374]">{formatCurrency(invoice.amount)}</p>
                    <p className="text-[10px] text-amber-500 mt-1">Due: {invoice.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
          <h3 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/orders/new"
              className="flex flex-col items-center gap-3 p-6 bg-[#221f1d] border border-[#292524]/30 hover:border-[#e5c374]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-[#e5c374]/10 flex items-center justify-center"
              >
                <Package className="w-6 h-6 text-[#e5c374]" />
              </div>
              <span className="text-xs font-medium text-[#a8a29e]">Place Order</span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex flex-col items-center gap-3 p-6 bg-[#221f1d] border border-[#292524]/30 hover:border-[#e5c374]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-[#e5c374]/10 flex items-center justify-center"
              >
                <Building2 className="w-6 h-6 text-[#e5c374]" />
              </div>
              <span className="text-xs font-medium text-[#a8a29e]">Browse Catalog</span>
            </Link>

            <Link
              href="/dashboard/invoices"
              className="flex flex-col items-center gap-3 p-6 bg-[#221f1d] border border-[#292524]/30 hover:border-[#e5c374]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-[#e5c374]/10 flex items-center justify-center"
              >
                <Receipt className="w-6 h-6 text-[#e5c374]" />
              </div>
              <span className="text-xs font-medium text-[#a8a29e]">Pay Invoice</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex flex-col items-center gap-3 p-6 bg-[#221f1d] border border-[#292524]/30 hover:border-[#e5c374]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-[#e5c374]/10 flex items-center justify-center"
              >
                <CreditCard className="w-6 h-6 text-[#e5c374]" />
              </div>
              <span className="text-xs font-medium text-[#a8a29e]">Team Access</span>
            </Link>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
