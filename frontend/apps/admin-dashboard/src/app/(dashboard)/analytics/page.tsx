"use client";

import { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Truck,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Revenue trends data
const revenueTrends = [
  { month: "Jan", revenue: 850, costs: 620, profit: 230 },
  { month: "Feb", revenue: 920, costs: 680, profit: 240 },
  { month: "Mar", revenue: 1050, costs: 750, profit: 300 },
  { month: "Apr", revenue: 1100, costs: 780, profit: 320 },
  { month: "May", revenue: 1250, costs: 890, profit: 360 },
  { month: "Jun", revenue: 1180, costs: 840, profit: 340 },
];

// Sales by product
const salesByProduct = [
  { name: "Ordinary Portland", value: 450, color: "#e5c374" },
  { name: "Rapid Hardening", value: 280, color: "#22c55e" },
  { name: "Sulfate Resisting", value: 180, color: "#3b82f6" },
  { name: "White Cement", value: 90, color: "#6b7280" },
];

// Customer acquisition
const customerData = [
  { month: "Jan", new: 45, returning: 320 },
  { month: "Feb", new: 52, returning: 340 },
  { month: "Mar", new: 48, returning: 365 },
  { month: "Apr", new: 61, returning: 390 },
  { month: "May", new: 58, returning: 410 },
  { month: "Jun", new: 65, returning: 435 },
];

// Regional performance
const regionalPerformance = [
  { region: "Lagos", sales: 1250, target: 1200, fulfillment: 98 },
  { region: "Abuja", sales: 850, target: 900, fulfillment: 95 },
  { region: "Port Harcourt", sales: 720, target: 700, fulfillment: 92 },
  { region: "Kano", sales: 450, target: 500, fulfillment: 88 },
  { region: "Ibadan", sales: 380, target: 400, fulfillment: 94 },
];

// Operational metrics
const operationalMetrics = [
  { name: "Production", value: 92, target: 95, unit: "%" },
  { name: "OTD", value: 96, target: 98, unit: "%" },
  { name: "Quality", value: 99.2, target: 99, unit: "%" },
  { name: "Safety", value: 45, target: 30, unit: "days" },
];

interface Insight {
  id: string;
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
  metric: string;
  change: number;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "positive",
    title: "Revenue Growth Accelerating",
    description: "Q1 revenue up 18% YoY, exceeding forecast by 5%",
    metric: "Revenue",
    change: 18.2,
  },
  {
    id: "2",
    type: "negative",
    title: "Rising Logistics Costs",
    description: "Fuel surcharge increased logistics costs by 8%",
    metric: "Logistics",
    change: -8.5,
  },
  {
    id: "3",
    type: "positive",
    title: "Customer Retention Improving",
    description: "92% retention rate, up from 88% last quarter",
    metric: "Retention",
    change: 4.5,
  },
  {
    id: "4",
    type: "neutral",
    title: "Inventory Levels Optimal",
    description: "Current stock covers 28 days of sales",
    metric: "Inventory",
    change: 0,
  },
];

const formatCurrency = (amount: number) => {
  return `₦${amount}M`;
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("YTD");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">
            BI/Analytics Command Center
          </h1>
          <p className="text-cement-500">
            Real-time business intelligence and performance analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
          >
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="YTD">Year to Date</option>
            <option value="1Y">Last 12 Months</option>
          </select>
          <button className="flex items-center rounded-lg border border-cement-300 px-4 py-2 text-sm font-medium text-cement-700 hover:bg-cement-50">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: "₦6.35B",
            change: 12.5,
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            label: "Active Customers",
            value: "1,245",
            change: 8.2,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Orders Fulfilled",
            value: "3,892",
            change: 15.3,
            icon: Package,
            color: "text-purple-600",
          },
          {
            label: "Fleet Utilization",
            value: "87%",
            change: -2.1,
            icon: Truck,
            color: "text-yellow-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-brand-primary" />
                <span
                  className={`flex items-center text-xs font-medium ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-cement-500">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-cement-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-brand-primary" />
          <h2 className="text-lg font-semibold text-cement-900">
            AI-Powered Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${
                insight.type === "positive"
                  ? "bg-green-50 border-green-200"
                  : insight.type === "negative"
                  ? "bg-red-50 border-red-200"
                  : "bg-cement-50 border-cement-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-medium ${
                        insight.type === "positive"
                          ? "text-green-800"
                          : insight.type === "negative"
                          ? "text-red-800"
                          : "text-cement-800"
                      }`}
                    >
                      {insight.metric}
                    </span>
                    {insight.change !== 0 && (
                      <span
                        className={`text-xs font-medium ${
                          insight.change > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {insight.change > 0 ? "+" : ""}
                        {insight.change}%
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-cement-900">{insight.title}</p>
                  <p className="text-sm text-cement-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cement-900">
              Revenue vs Costs
            </h2>
            <button className="p-2 hover:bg-cement-100 rounded-lg">
              <Eye className="h-4 w-4 text-cement-600" />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₦${value}M`}
                />
                <Tooltip
                  formatter={(value: number) => [`₦${value}M`, ""]}
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#e5c374" />
                <Bar dataKey="costs" name="Costs" fill="#ef4444" />
                <Bar dataKey="profit" name="Profit" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Product */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cement-900">
              Sales by Product
            </h2>
            <button className="p-2 hover:bg-cement-100 rounded-lg">
              <Eye className="h-4 w-4 text-cement-600" />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByProduct}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} MT`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Trends */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cement-900">
              Customer Acquisition
            </h2>
            <button className="p-2 hover:bg-cement-100 rounded-lg">
              <Eye className="h-4 w-4 text-cement-600" />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerData}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="new"
                  name="New Customers"
                  stroke="#22c55e"
                  fill="url(#colorNew)"
                />
                <Area
                  type="monotone"
                  dataKey="returning"
                  name="Returning"
                  stroke="#3b82f6"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cement-900">
              Regional Performance
            </h2>
            <button className="p-2 hover:bg-cement-100 rounded-lg">
              <Eye className="h-4 w-4 text-cement-600" />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₦${value}M`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "fulfillment" ? `${value}%` : `₦${value}M`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#e5c374" />
                <Bar dataKey="target" name="Target" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-cement-900 mb-4">
          Operational Excellence Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {operationalMetrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e5e5"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={
                      metric.value >= metric.target ? "#22c55e" : "#e5c374"
                    }
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(metric.value / 100) * 251.2} 251.2`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-cement-900">
                    {metric.value}
                    {metric.unit}
                  </span>
                </div>
              </div>
              <p className="mt-2 font-medium text-cement-700">{metric.name}</p>
              <p className="text-xs text-cement-500">Target: {metric.target}{metric.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
