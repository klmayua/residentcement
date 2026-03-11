"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, ShoppingCart, Package, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { api, formatCurrency, formatDate, getStatusColor } from "@/lib/api";

const statCards = [
  { name: "Total Revenue", icon: DollarSign, color: "bg-green-500" },
  { name: "Total Orders", icon: ShoppingCart, color: "bg-blue-500" },
  { name: "Total Customers", icon: Users, color: "bg-purple-500" },
  { name: "Total Products", icon: Package, color: "bg-orange-500" },
];

const recentOrders = [
  { id: "1", orderNumber: "ORD-001", customer: "Doe Cement", total: 250000, status: "PENDING", date: "2026-03-08" },
  { id: "2", orderNumber: "ORD-002", customer: "BuildRight", total: 180000, status: "CONFIRMED", date: "2026-03-08" },
  { id: "3", orderNumber: "ORD-003", customer: "ABC Supplies", total: 95000, status: "DELIVERED", date: "2026-03-07" },
  { id: "4", orderNumber: "ORD-004", customer: "Metro Builders", total: 420000, status: "PROCESSING", date: "2026-03-07" },
  { id: "5", orderNumber: "ORD-005", customer: "City Construction", total: 150000, status: "PENDING", date: "2026-03-06" },
];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
  });

  const mockStats = {
    totalRevenue: 12500000,
    totalOrders: 156,
    totalCustomers: 48,
    totalProducts: 24,
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 15.3,
    productsChange: -2.1,
  };

  const displayStats = stats || mockStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(displayStats.totalRevenue)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{displayStats.revenueChange}%</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalOrders}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{displayStats.ordersChange}%</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalCustomers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{displayStats.customersChange}%</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalProducts}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            <span className="text-red-500">{Math.abs(displayStats.productsChange)}%</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{order.orderNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{order.customer}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{formatCurrency(order.total)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
