"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreVertical, Eye, RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/api";

const methodConfig: Record<string, { icon: string; color: string }> = {
  CARD: { icon: "💳", color: "bg-blue-100 text-blue-800900200" },
  BANK_TRANSFER: { icon: "🏦", color: "bg-green-100 text-green-800900200" },
  USSD: { icon: "📱", color: "bg-purple-100 text-purple-800900200" },
  CASH: { icon: "💵", color: "bg-amber-100 text-amber-800900200" },
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
  const [page, setPage] = useState(1);

  // Fetch payments from API
  const { data: paymentsData, isLoading, error, refetch } = usePayments({
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    method: methodFilter !== "all" ? methodFilter : undefined,
  });

  const payments = paymentsData?.data || [];
  const pagination = paymentsData?.meta?.pagination;

  // Filter payments client-side for search
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.order?.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats from API data
  const totalReceived = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = payments
    .filter((p) => p.status === "FAILED")
    .reduce((sum, p) => sum + p.amount, 0);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500">Failed to load payments</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Payments</h1>
          <p className="text-cement-500">Track and manage payments</p>
        </div>
        <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-cement-700 hover:bg-cement-50800200700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Total Received</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {isLoading ? "..." : formatCurrency(totalReceived)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100900">
              <CheckCircle className="h-6 w-6 text-green-600400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {isLoading ? "..." : formatCurrency(pendingAmount)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100900">
              <Clock className="h-6 w-6 text-yellow-600400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cement-500">Failed</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {isLoading ? "..." : formatCurrency(failedAmount)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100900">
              <XCircle className="h-6 w-6 text-red-600400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cement-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-cement-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none700800"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700800"
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
            className="rounded-lg border border-cement-300 px-3 py-2 text-sm focus:border-primary focus:outline-none700800"
          >
            <option value="all">All Methods</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="USSD">USSD</option>
            <option value="CASH">Cash</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-cement-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const StatusIcon = statusIconConfig[payment.status];
                  return (
                    <tr key={payment.id} className="hover:bg-cement-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-mono text-sm text-cement-900">{payment.paymentReference}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-primary">
                          {payment.order?.orderNumber || "-"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">
                        {payment.customer?.name || "Unknown"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-cement-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${methodConfig[payment.method]?.color}`}>
                          <span className="mr-1">{methodConfig[payment.method]?.icon || "💳"}</span>
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="rounded p-1 hover:bg-cement-100" title="View Details">
                          <Eye className="h-4 w-4 text-cement-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-cement-500">
              Showing {(page - 1) * pagination.limit + 1} -{" "}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} payments
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-cement-50 disabled:opacity-50700800"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => (pagination.hasMore ? p + 1 : p))}
                disabled={!pagination.hasMore}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-cement-50 disabled:opacity-50700800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
