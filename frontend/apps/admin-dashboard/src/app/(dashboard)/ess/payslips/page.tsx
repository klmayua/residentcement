"use client";

import { useState } from "react";
import { FileText, Download, Eye, ChevronDown } from "lucide-react";

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "available" | "pending";
}

const mockPayslips: Payslip[] = [
  { id: "1", month: "March", year: 2026, grossPay: 450000, deductions: 67500, netPay: 382500, status: "pending" },
  { id: "2", month: "February", year: 2026, grossPay: 450000, deductions: 67500, netPay: 382500, status: "available" },
  { id: "3", month: "January", year: 2026, grossPay: 450000, deductions: 67500, netPay: 382500, status: "available" },
  { id: "4", month: "December", year: 2025, grossPay: 450000, deductions: 67500, netPay: 382500, status: "available" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function PayslipsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">My Payslips</h1>
          <p className="text-cement-500">View and download your salary slips.</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 rounded-lg border border-cement-300 text-sm"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Gross Pay</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Net Pay</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-cement-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {mockPayslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-brand-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium text-cement-900">{payslip.month} {payslip.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-900">{formatCurrency(payslip.grossPay)}</td>
                  <td className="px-6 py-4 text-sm text-red-600">-{formatCurrency(payslip.deductions)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">{formatCurrency(payslip.netPay)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payslip.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payslip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-cement-400 hover:text-brand-primary"
                        title="View"
                        disabled={payslip.status === "pending"}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-cement-400 hover:text-brand-primary"
                        title="Download"
                        disabled={payslip.status === "pending"}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-cement-900 mb-4">Year-to-Date Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-cement-500">Total Gross</p>
            <p className="text-xl font-bold text-cement-900">{formatCurrency(1350000)}</p>
          </div>
          <div>
            <p className="text-sm text-cement-500">Total Deductions</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(202500)}</p>
          </div>
          <div>
            <p className="text-sm text-cement-500">Total Net</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(1147500)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
