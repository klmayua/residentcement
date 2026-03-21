"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/api";
import Link from "next/link";

const statCards = [
  { name: "Total Revenue", icon: DollarSign, color: "bg-green-500", key: "totalRevenue" },
  { name: "Total Orders", icon: ShoppingCart, color: "bg-blue-500", key: "totalOrders" },
  { name: "Total Customers", icon: Users, color: "bg-purple-500", key: "totalCustomers" },
  { name: "Total Products", icon: Package, color: "bg-orange-500", key: "totalProducts" },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState("month");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  // Fetch recent orders
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    page: 1,
    limit: 5,
  });

  const displayStats = stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  };

  const recentOrders = ordersData?.data || [];
  const isLoading = statsLoading || ordersLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.name}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : card.key === "totalRevenue" ? (
                    formatCurrency(displayStats[card.key as keyof typeof displayStats] as number)
                  ) : (
                    (displayStats[card.key as keyof typeof displayStats] as number)?.toLocaleString()
                  )}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} bg-opacity-10`}>
                <card.icon className={`h-6 w-6 ${card.color.replace("bg-", "text-")}`} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center text-sm">
                {(displayStats[`${card.key.replace("total", "").toLowerCase()}Change` as keyof typeof displayStats] as number) >= 0 ? (
                  <>
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      {displayStats[`${card.key.replace("total", "").toLowerCase()}Change` as keyof typeof displayStats] as number}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-red-500">
                      {Math.abs(displayStats[`${card.key.replace("total", "").toLowerCase()}Change` as keyof typeof displayStats] as number)}%
                    </span>
                  </>
                )}
                <span className="ml-1 text-gray-500 dark:text-gray-400">vs last {period}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">
                      <Link href={`/orders?id=${order.id}`}>{order.orderNumber}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {order.customer?.name || order.customerName || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
