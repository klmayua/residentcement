"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Truck,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Eye,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Strategic KPI Data
const revenueData = [
  { month: "Jan", actual: 850, projected: 800 },
  { month: "Feb", actual: 920, projected: 850 },
  { month: "Mar", actual: 1050, projected: 950 },
  { month: "Apr", actual: 1100, projected: 1050 },
  { month: "May", actual: 1250, projected: 1150 },
  { month: "Jun", actual: 1180, projected: 1200 },
];

const regionalData = [
  { name: "Lagos", value: 45 },
  { name: "Abuja", value: 25 },
  { name: "Port Harcourt", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#e5c374", "#22c55e", "#3b82f6", "#6b7280"];

interface BoardAlert {
  id: string;
  severity: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  date: string;
}

const mockAlerts: BoardAlert[] = [
  {
    id: "1",
    severity: "high",
    category: "Finance",
    title: "Q1 Revenue Target At Risk",
    description: "Current trajectory shows 8% below target. Immediate action required.",
    date: "2026-04-02",
  },
  {
    id: "2",
    severity: "medium",
    category: "Operations",
    title: "Production Line Maintenance",
    description: "Line 3 scheduled maintenance delayed by 1 week.",
    date: "2026-04-01",
  },
  {
    id: "3",
    severity: "low",
    category: "HR",
    title: "Board Meeting Rescheduled",
    description: "Q2 board meeting moved from April 15 to April 22.",
    date: "2026-03-30",
  },
];

interface AgendaItem {
  id: string;
  title: string;
  presenter: string;
  duration: string;
  status: "pending" | "in_progress" | "completed";
}

const mockAgenda: AgendaItem[] = [
  {
    id: "1",
    title: "Q1 2026 Financial Review",
    presenter: "CFO",
    duration: "30 min",
    status: "completed",
  },
  {
    id: "2",
    title: "Expansion Strategy Discussion",
    presenter: "CEO",
    duration: "45 min",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Risk Management Update",
    presenter: "Risk Committee",
    duration: "20 min",
    status: "pending",
  },
  {
    id: "4",
    title: "Board Resolutions",
    presenter: "Company Secretary",
    duration: "15 min",
    status: "pending",
  },
];

interface DecisionItem {
  id: string;
  title: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
}

const mockDecisions: DecisionItem[] = [
  {
    id: "1",
    title: "Approval of ₦2B Capital Expenditure for New Plant",
    category: "Capital",
    status: "pending",
    votesFor: 4,
    votesAgainst: 2,
    votesAbstain: 1,
  },
  {
    id: "2",
    title: "Appointment of New Non-Executive Director",
    category: "Governance",
    status: "approved",
    votesFor: 6,
    votesAgainst: 0,
    votesAbstain: 1,
  },
];

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString()}`;
};

export default function BoardDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q1");

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getAgendaStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-cement-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">
            Board Chairman Dashboard
          </h1>
          <p className="text-cement-500">
            Strategic overview and executive decision support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
          >
            <option value="Q1">Q1 2026</option>
            <option value="Q2">Q2 2026></option>
            <option value="YTD">Year to Date</option>
            <option value="FY2025">FY 2025</option>
          </select>
          <button className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Executive Report
          </button>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <DollarSign className="h-8 w-8 text-brand-primary" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Revenue (YTD)</p>
          <p className="text-2xl font-bold text-cement-900">{formatCurrency(6350000000)}</p>
          <p className="text-xs text-cement-400 mt-1">Target: {formatCurrency(6000000000)}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Target className="h-8 w-8 text-green-500" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3pp
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">EBITDA Margin</p>
          <p className="text-2xl font-bold text-cement-900">28.4%</p>
          <p className="text-xs text-cement-400 mt-1">Target: 27%</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Building2 className="h-8 w-8 text-blue-500" />
            <span className="flex items-center text-xs font-medium text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1.2%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Production Output</p>
          <p className="text-2xl font-bold text-cement-900">1.2M MT</p>
          <p className="text-xs text-cement-400 mt-1">Target: 1.25M MT</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Users className="h-8 w-8 text-purple-500" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2%
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-cement-500">Share Price</p>
          <p className="text-2xl font-bold text-cement-900">₦20.50</p>
          <p className="text-xs text-cement-400 mt-1">+105% from IPO</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Projection */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cement-900">
              Revenue vs Projection
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-primary" />
                <span className="text-cement-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cement-300" />
                <span className="text-cement-600">Projected</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5c374" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e5c374" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual"
                  stroke="#e5c374"
                  strokeWidth={2}
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  name="Projected"
                  stroke="#d1d5db"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Revenue Split */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-cement-900 mb-4">
            Revenue by Region
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "#1c1917",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {regionalData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-cement-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-cement-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board Alerts */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-cement-900">Board Alerts</h2>
              <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {mockAlerts.filter((a) => a.severity === "high").length} High Priority
              </span>
            </div>
          </div>
          <div className="divide-y divide-cement-200">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-cement-50">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`h-5 w-5 flex-shrink-0 ${
                      alert.severity === "high"
                        ? "text-red-500"
                        : alert.severity === "medium"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-cement-500">
                        {alert.category}
                      </span>
                    </div>
                    <p className="font-medium text-cement-900 text-sm">
                      {alert.title}
                    </p>
                    <p className="text-xs text-cement-500 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Agenda */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-cement-900">Board Meeting</h2>
                <p className="text-xs text-cement-500">April 22, 2026 • 10:00 AM</p>
              </div>
              <button className="p-2 hover:bg-cement-100 rounded-lg">
                <Calendar className="h-4 w-4 text-cement-600" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-cement-200">
            {mockAgenda.map((item) => (
              <div key={item.id} className="p-4 hover:bg-cement-50">
                <div className="flex items-start gap-3">
                  {getAgendaStatusIcon(item.status)}
                  <div className="flex-1">
                    <p className="font-medium text-cement-900 text-sm">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-cement-500">
                        {item.presenter}
                      </span>
                      <span className="text-xs text-cement-400">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Decisions */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-cement-900">Pending Decisions</h2>
              <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                {mockDecisions.filter((d) => d.status === "pending").length} Active
              </span>
            </div>
          </div>
          <div className="divide-y divide-cement-200">
            {mockDecisions.map((decision) => (
              <div key={decision.id} className="p-4 hover:bg-cement-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-cement-900 text-sm">
                      {decision.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {decision.votesFor} For
                      </span>
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        {decision.votesAgainst} Against
                      </span>
                      <span className="inline-flex rounded-full bg-cement-100 px-2 py-0.5 text-xs font-medium text-cement-800">
                        {decision.votesAbstain} Abstain
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-cement-100 rounded-lg">
                    <Eye className="h-4 w-4 text-cement-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <button className="w-full flex items-center justify-center py-2 text-sm font-medium text-brand-primary hover:underline">
              View All Resolutions
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
