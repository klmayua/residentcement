'use client';

import { SidebarLayout } from '@/components/dashboard/sidebar-layout';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', orders: 12, revenue: 8500000 },
  { month: 'Feb', orders: 15, revenue: 10200000 },
  { month: 'Mar', orders: 18, revenue: 12500000 },
  { month: 'Apr', orders: 14, revenue: 9800000 },
  { month: 'May', orders: 20, revenue: 14200000 },
  { month: 'Jun', orders: 22, revenue: 15800000 },
];

const topProducts = [
  { name: 'Limestone Cement 42.5R', quantity: 3200, revenue: 18240000 },
  { name: 'Ordinary Portland Cement', quantity: 2100, revenue: 11550000 },
  { name: 'Portland Limestone Blend', quantity: 1800, revenue: 9540000 },
  { name: 'Sulphate Resistant Cement', quantity: 1200, revenue: 7800000 },
];

export default function AnalyticsPage() {
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, m) => sum + m.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarLayout title="Analytics" subtitle="Business performance overview">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Total Revenue</p>
                <p className="text-2xl font-headline font-bold text-[#e5c374]">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-2 bg-[#e5c374]/10">
                <DollarSign className="w-5 h-5 text-[#e5c374]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500">+24%</span>
              <span className="text-[10px] text-[#57534e]">vs last period</span>
            </div>
          </div>

          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Total Orders</p>
                <p className="text-2xl font-headline font-bold text-[#e5c374]">{totalOrders}</p>
              </div>
              <div className="p-2 bg-[#e5c374]/10">
                <ShoppingCart className="w-5 h-5 text-[#e5c374]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500">+18%</span>
              <span className="text-[10px] text-[#57534e]">vs last period</span>
            </div>
          </div>

          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Avg Order Value</p>
                <p className="text-2xl font-headline font-bold text-[#e5c374]">{formatCurrency(avgOrderValue)}</p>
              </div>
              <div className="p-2 bg-[#e5c374]/10">
                <Package className="w-5 h-5 text-[#e5c374]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500">+5%</span>
              <span className="text-[10px] text-[#57534e]">vs last period</span>
            </div>
          </div>

          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">Total Volume</p>
                <p className="text-2xl font-headline font-bold text-[#e5c374]">8,300</p>
              </div>
              <div className="p-2 bg-[#e5c374]/10">
                <Package className="w-5 h-5 text-[#e5c374]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[#57534e]">bags delivered</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <h3 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Revenue Trend</h3>
            <div className="h-64 flex items-end gap-4">
              {monthlyData.map((month) => {
                const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));
                const height = (month.revenue / maxRevenue) * 100;
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-[#e5c374]/20 hover:bg-[#e5c374]/40 transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#292524] px-2 py-1 text-xs text-[#e9e1dd] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(month.revenue)}
                      </div>
                    </div>
                    <span className="text-xs text-[#57534e]">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-[#1c1917] border border-[#292524]/30 p-6">
            <h3 className="font-headline text-lg font-semibold text-[#e9e1dd] mb-6">Orders by Month</h3>
            <div className="h-64 flex items-end gap-4">
              {monthlyData.map((month) => {
                const maxOrders = Math.max(...monthlyData.map(m => m.orders));
                const height = (month.orders / maxOrders) * 100;
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-[#745B17]/40 hover:bg-[#745B17]/60 transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#292524] px-2 py-1 text-xs text-[#e9e1dd] opacity-0 group-hover:opacity-100 transition-opacity">
                        {month.orders} orders
                      </div>
                    </div>
                    <span className="text-xs text-[#57534e]">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#1c1917] border border-[#292524]/30">
          <div className="px-6 py-4 border-b border-[#292524]/30">
            <h3 className="font-headline text-lg font-semibold text-[#e9e1dd]">Top Products by Revenue</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#292524]/30">
                <th className="text-left text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Product</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Quantity Sold</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">Revenue</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-[#57534e] font-medium px-6 py-4">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292524]/10">
              {topProducts.map((product, index) => {
                const percentage = (product.revenue / topProducts.reduce((sum, p) => sum + p.revenue, 0)) * 100;
                return (
                  <tr key={product.name} className="border-b border-[#292524]/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#e5c374]/10 flex items-center justify-center text-xs font-bold text-[#e5c374]">
                          {index + 1}
                        </span>
                        <span className="text-sm text-[#e9e1dd]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-[#e9e1dd]">{product.quantity.toLocaleString()} bags</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[#e5c374]">{formatCurrency(product.revenue)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-[#292524]/30 overflow-hidden">
                          <div className="h-full bg-[#e5c374]" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs text-[#57534e]">{percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
