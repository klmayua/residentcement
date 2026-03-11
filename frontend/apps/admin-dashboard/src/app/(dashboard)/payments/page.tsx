"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreVertical, Eye, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { api, formatCurrency, formatDate, getStatusColor } from "@/lib/api";

const mockPayments = [
  { id: "PAY-001", paymentReference: "RC/2026/03/08/001", orderId: "ORD-2026-001", orderNumber: "ORD-2026-001", customerName: "Doe Cement Distributors", amount: 250000, method: "CARD", status: "PAID", createdAt: "2026-03-08T10:35:00Z", confirmedAt: "2026-03-08T10:36:00Z" },
  { id: "PAY-002", paymentReference: "RC/2026/03/08/002", orderId: "ORD-2026-002", orderNumber: "ORD-2026-002", customerName: "BuildRight Construction", amount: 180000, method: "BANK_TRANSFER", status: "PENDING", createdAt: "2026-03-08T09:20:00Z", confirmedAt: null },
  { id: "PAY-003", paymentReference: "RC/2026/03/07/001", orderId: "ORD-2026-003", orderNumber: "ORD-2026-003", customerName: "ABC Supplies Ltd", amount: 95000, method: "USSD", status: "PAID", createdAt: "2026-03-07T14:25:00Z", confirmedAt: "2026-03-07T14:26:00Z" },
  { id: "PAY-004", paymentReference: "RC/2026/03/07/002", orderId: "ORD-2026-004", orderNumber: "ORD-2026-004", customerName: "Metro Builders Inc", amount: 420000, method: "CARD", status: "PAID", createdAt: "2026-03-07T11:50:00Z", confirmedAt: "2026-03-07T11:52:00Z" },
  { id: "PAY-005", paymentReference: "RC/2026/03/06/001", orderId: "ORD-2026-005", orderNumber: "ORD-2026-005", customerName: "City Construction", amount: 150000, method: "BANK_TRANSFER", status: "FAILED", createdAt: "2026-03-06T16:05:00Z", confirmedAt: null, failureReason: "Insufficient funds" },
  { id: "PAY-006", paymentReference: "RC/2026/03/06/002", orderId: "ORD-2026-006", orderNumber: "ORD-2026-006", customerName: "Doe Cement Distributors", amount: 380000, method: "CARD", status: "PAID", createdAt: "2026-03-06T09:35:00Z", confirmedAt: "2026-03-06T09:36:00Z" },
  { id: "PAY-007", paymentReference: "RC/2026/03/05/001", orderId: "ORD-2026-007", orderNumber: "ORD-2026-007", customerName: "Delta Builders", amount: 72000, method: "USSD", status: "REFUNDED", createdAt: "2026-03-05T15:25:00Z", confirmedAt: "2026-03-05T15:26:00Z", refundedAt: "2026-03-06T10:00:00Z" },
  { id: "PAY-008", paymentReference: "RC/2026/03/05/002", orderId: "ORD-2026-008", orderNumber: "ORD-2026-008", customerName: "BuildRight Construction", amount: 295000, method: "BANK_TRANSFER", status: "PAID", createdAt: "2026-03-05T10:05:00Z", confirmedAt: "2026-03-05T14:30:00Z" },
];

const methodConfig: Record<string, { icon: string; color: string }> = {
  CARD: { icon: "💳", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  BANK_TRANSFER: { icon: "🏦", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  USSD: { icon: "📱", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
};

const statusIconConfig: Record<string, any> = {
  PAID: CheckCircle,
  PENDING: Clock,
  FAILED: XCircle,
  REFUNDED: RefreshCw,
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.paymentReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = mockPayments.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockPayments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = mockPayments.filter(p => p.status === "FAILED").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage payments</p>
        </div>
        <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Received</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(failedAmount)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Methods</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="USSD">USSD</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => {
                const StatusIcon = statusIconConfig[payment.status];
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-mono text-sm text-gray-900 dark:text-white">{payment.paymentReference}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-primary">{payment.orderNumber}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {payment.customerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${methodConfig[payment.method]?.color}`}>
                        <span className="mr-1">{methodConfig[payment.method]?.icon}</span>
                        {payment.method.replace("_", " ")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {StatusIcon && <StatusIcon className={`mr-2 h-4 w-4 ${payment.status === 'PAID' ? 'text-green-500' : payment.status === 'FAILED' ? 'text-red-500' : payment.status === 'REFUNDED' ? 'text-purple-500' : 'text-yellow-500'}`} />}
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="View Details">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredPayments.length} of {mockPayments.length} payments
          </div>
          <div className="flex space-x-2">
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Previous</button>
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
