"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, ShoppingCart, Package, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { api, formatCurrency, formatDate, getStatusColor } from "@/lib/api";

const statCards = [
 { name:"Total Revenue", icon: DollarSign, color:"bg-green-500"},
 { name:"Total Orders", icon: ShoppingCart, color:"bg-blue-500"},
 { name:"Total Customers", icon: Users, color:"bg-purple-500"},
 { name:"Total Products", icon: Package, color:"bg-orange-500"},
];

const recentOrders = [
 { id:"1", orderNumber:"ORD-001", customer:"Doe Cement", total: 250000, status:"PENDING", date:"2026-03-08"},
 { id:"2", orderNumber:"ORD-002", customer:"BuildRight", total: 180000, status:"CONFIRMED", date:"2026-03-08"},
 { id:"3", orderNumber:"ORD-003", customer:"ABC Supplies", total: 95000, status:"DELIVERED", date:"2026-03-07"},
 { id:"4", orderNumber:"ORD-004", customer:"Metro Builders", total: 420000, status:"PROCESSING", date:"2026-03-07"},
 { id:"5", orderNumber:"ORD-005", customer:"City Construction", total: 150000, status:"PENDING", date:"2026-03-06"},
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
 <h1 className="text-2xl font-bold text-cement-900">Dashboard Overview</h1>
 <p className="text-cement-500">Welcome back! Here's what's happening today.</p>
 </div>

 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Total Revenue</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{formatCurrency(displayStats.totalRevenue)}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
 <DollarSign className="h-6 w-6 text-green-600"/>
 </div>
 </div>
 <div className="mt-4 flex items-center text-sm">
 <TrendingUp className="mr-1 h-4 w-4 text-green-500"/>
 <span className="text-green-500">{displayStats.revenueChange}%</span>
 <span className="ml-1 text-cement-500">vs last month</span>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Total Orders</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{displayStats.totalOrders}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
 <ShoppingCart className="h-6 w-6 text-blue-600"/>
 </div>
 </div>
 <div className="mt-4 flex items-center text-sm">
 <TrendingUp className="mr-1 h-4 w-4 text-green-500"/>
 <span className="text-green-500">{displayStats.ordersChange}%</span>
 <span className="ml-1 text-cement-500">vs last month</span>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Total Customers</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{displayStats.totalCustomers}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
 <Users className="h-6 w-6 text-purple-600"/>
 </div>
 </div>
 <div className="mt-4 flex items-center text-sm">
 <TrendingUp className="mr-1 h-4 w-4 text-green-500"/>
 <span className="text-green-500">{displayStats.customersChange}%</span>
 <span className="ml-1 text-cement-500">vs last month</span>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Total Products</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{displayStats.totalProducts}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
 <Package className="h-6 w-6 text-orange-600"/>
 </div>
 </div>
 <div className="mt-4 flex items-center text-sm">
 <TrendingDown className="mr-1 h-4 w-4 text-red-500"/>
 <span className="text-red-500">{Math.abs(displayStats.productsChange)}%</span>
 <span className="ml-1 text-cement-500">vs last month</span>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Recent Orders</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Order</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Customer</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Total</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {recentOrders.map((order) => (
 <tr key={order.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{order.orderNumber}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{order.customer}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{formatCurrency(order.total)}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
 {order.status}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-500">{formatDate(order.date)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
