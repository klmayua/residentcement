"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  PieChart,
  BarChart3,
  Globe,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  category: string;
  year: string;
  period?: string;
  datePublished: string;
  size: string;
  language: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Annual Report 2025",
    type: "Annual Report",
    category: "Financial",
    year: "2025",
    datePublished: "2026-03-15",
    size: "12.5 MB",
    language: "English",
  },
  {
    id: "2",
    title: "Q1 2026 Financial Results",
    type: "Quarterly Report",
    category: "Financial",
    year: "2026",
    period: "Q1",
    datePublished: "2026-04-01",
    size: "3.2 MB",
    language: "English",
  },
  {
    id: "3",
    title: "Sustainability Report 2025",
    type: "ESG Report",
    category: "Sustainability",
    year: "2025",
    datePublished: "2026-03-01",
    size: "8.7 MB",
    language: "English",
  },
  {
    id: "4",
    title: "Q4 2025 Financial Results",
    type: "Quarterly Report",
    category: "Financial",
    year: "2025",
    period: "Q4",
    datePublished: "2026-01-31",
    size: "3.1 MB",
    language: "English",
  },
  {
    id: "5",
    title: "Annual Report 2024",
    type: "Annual Report",
    category: "Financial",
    year: "2024",
    datePublished: "2025-03-15",
    size: "11.8 MB",
    language: "English",
  },
  {
    id: "6",
    title: "Corporate Governance Report 2025",
    type: "Governance",
    category: "Governance",
    year: "2025",
    datePublished: "2026-02-28",
    size: "4.5 MB",
    language: "English",
  },
  {
    id: "7",
    title: "Investor Presentation - March 2026",
    type: "Presentation",
    category: "Financial",
    year: "2026",
    datePublished: "2026-03-20",
    size: "8.7 MB",
    language: "English",
  },
  {
    id: "8",
    title: "Q3 2025 Financial Results",
    type: "Quarterly Report",
    category: "Financial",
    year: "2025",
    period: "Q3",
    datePublished: "2025-10-31",
    size: "3.0 MB",
    language: "English",
  },
];

const categories = ["All", "Financial", "Sustainability", "Governance"];
const years = ["All", "2026", "2025", "2024", "2023"];
const types = ["All", "Annual Report", "Quarterly Report", "ESG Report", "Presentation", "Governance"];

export default function InvestorReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || report.category === selectedCategory;
    const matchesYear = selectedYear === "All" || report.year === selectedYear;
    const matchesType = selectedType === "All" || report.type === selectedType;
    return matchesSearch && matchesCategory && matchesYear && matchesType;
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case "Annual Report":
      case "Quarterly Report":
        return <BarChart3 className="h-8 w-8 text-blue-500" />;
      case "ESG Report":
        return <Globe className="h-8 w-8 text-green-500" />;
      case "Presentation":
        return <PieChart className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-cement-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cement-900">Financial Reports</h1>
        <p className="text-cement-500">
          Access all regulatory filings and investor documents.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-cement-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "All" ? "All Years" : year}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              {getReportIcon(report.type)}
              <span className="inline-flex rounded-full bg-cement-100 px-2.5 py-0.5 text-xs font-medium text-cement-800">
                {report.year}
              </span>
            </div>
            <h3 className="font-semibold text-cement-900 mb-1 group-hover:text-brand-primary transition-colors">
              {report.title}
            </h3>
            <p className="text-sm text-cement-500 mb-4">
              {report.type} {report.period && `• ${report.period}`}
            </p>
            <div className="flex items-center justify-between text-xs text-cement-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(report.datePublished).toLocaleDateString("en-NG")}
              </div>
              <div className="flex items-center gap-3">
                <span>{report.size}</span>
                <Download className="h-4 w-4 text-cement-400 group-hover:text-brand-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-cement-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Annual Reports", icon: BarChart3, count: "5 reports" },
            { label: "Quarterly Results", icon: TrendingUp, count: "20 reports" },
            { label: "ESG & Sustainability", icon: Globe, count: "8 reports" },
            { label: "Corporate Governance", icon: FileText, count: "12 reports" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="flex items-center p-4 rounded-lg border border-cement-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left"
              >
                <Icon className="h-8 w-8 text-brand-primary mr-3" />
                <div>
                  <p className="font-medium text-cement-900">{item.label}</p>
                  <p className="text-xs text-cement-500">{item.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
