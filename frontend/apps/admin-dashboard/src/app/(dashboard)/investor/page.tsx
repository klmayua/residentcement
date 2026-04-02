"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Building,
  FileText,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock share price data
const sharePriceData = [
  { month: "Jan", price: 12.5 },
  { month: "Feb", price: 13.2 },
  { month: "Mar", price: 12.8 },
  { month: "Apr", price: 14.1 },
  { month: "May", price: 15.3 },
  { month: "Jun", price: 14.9 },
  { month: "Jul", price: 16.2 },
  { month: "Aug", price: 17.1 },
  { month: "Sep", price: 16.8 },
  { month: "Oct", price: 18.5 },
  { month: "Nov", price: 19.2 },
  { month: "Dec", price: 20.5 },
];

// Mock dividend data
const dividendData = [
  { year: "2020", dividend: 1.2 },
  { year: "2021", dividend: 1.5 },
  { year: "2022", dividend: 1.8 },
  { year: "2023", dividend: 2.1 },
  { year: "2024", dividend: 2.5 },
  { year: "2025", dividend: 2.8 },
  { year: "2026", dividend: 3.2 },
];

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Q1 2026 Results Exceed Expectations",
    date: "2026-04-01",
    category: "Financial Results",
    summary:
      "Revenue up 15% YoY driven by strong demand in Eastern Nigeria markets.",
  },
  {
    id: "2",
    title: "New Production Line Commissioned",
    date: "2026-03-15",
    category: "Operations",
    summary:
      "50% capacity increase from new automated line at Lagos facility.",
  },
  {
    id: "3",
    title: "Sustainability Report 2025 Published",
    date: "2026-03-01",
    category: "ESG",
    summary: "30% reduction in carbon emissions achieved ahead of schedule.",
  },
];

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Annual Report 2025",
    type: "PDF",
    date: "2026-03-15",
    size: "12.5 MB",
  },
  {
    id: "2",
    title: "Q1 2026 Financial Statements",
    type: "PDF",
    date: "2026-04-01",
    size: "3.2 MB",
  },
  {
    id: "3",
    title: "Investor Presentation - March 2026",
    type: "PDF",
    date: "2026-03-20",
    size: "8.7 MB",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};

export default function InvestorPortalPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">
            Investor Relations
          </h1>
          <p className="text-cement-500">
            Financial performance and shareholder information.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center rounded-lg border border-cement-300 px-4 py-2 text-sm font-medium text-cement-700 hover:bg-cement-50">
            <Download className="mr-2 h-4 w-4" />
            Download IR Kit
          </button>
          <button className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            Subscribe to Updates
          </button>
        </div>
      </div>

      {/* Share Price Ticker */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-4">
              <h2 className="text-lg font-semibold text-cement-900">
                RCM Share Price
              </h2>
              <span className="text-3xl font-bold text-cement-900">₦20.50</span>
              <span className="flex items-center text-green-600 font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +2.5% (₦0.50)
              </span>
            </div>
            <p className="text-sm text-cement-500 mt-1">
              Last updated: Apr 2, 2026 | Market: CLOSED
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-brand-primary text-white"
                    : "bg-cement-100 text-cement-700 hover:bg-cement-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sharePriceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5c374" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e5c374" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={[10, 22]}
                tickFormatter={(value) => `₦${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`₦${value}`, "Share Price"]}
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#e5c374"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Building className="h-8 w-8 text-brand-primary" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Market Cap</p>
          <p className="text-2xl font-bold text-cement-900">₦41.0B</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +14%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Dividend Yield</p>
          <p className="text-2xl font-bold text-cement-900">15.6%</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">P/E Ratio</p>
          <p className="text-2xl font-bold text-cement-900">12.4x</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-purple-500" />
            <span className="flex items-center text-xs font-medium text-cement-500">
              -
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">52-Week Range</p>
          <p className="text-2xl font-bold text-cement-900">₦12.50 - ₦20.50</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Feed */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-cement-900">Latest News</h2>
              <a
                href="#"
                className="text-sm font-medium text-brand-primary hover:underline"
              >
                View All
              </a>
            </div>
          </div>
          <div className="divide-y divide-cement-200">
            {mockNews.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-cement-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary">
                        {item.category}
                      </span>
                      <span className="text-xs text-cement-500">
                        {new Date(item.date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-cement-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-cement-600">{item.summary}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-cement-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents & Dividend History */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cement-900">
                Financial Documents
              </h2>
              <a
                href="#"
                className="text-sm font-medium text-brand-primary hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-cement-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium text-cement-900">{doc.title}</p>
                      <p className="text-xs text-cement-500">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-cement-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Dividend History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-cement-900 mb-4">
              Dividend History
            </h2>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dividendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="year" stroke="#6b7280" fontSize={10} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={10}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₦${value}`,
                      "Dividend per Share",
                    ]}
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dividend"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
