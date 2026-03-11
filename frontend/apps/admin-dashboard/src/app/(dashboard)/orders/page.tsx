"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreVertical, Eye, X, Truck } from "lucide-react";
import { api, formatCurrency, formatDate, getStatusColor } from "@/lib/api";

const mockOrders = [
  { id: "ORD-001", orderNumber: "ORD-2026-001", customerName: "Doe Cement Distributors", customerId: "CUST-001", total: 250000, status: "PENDING", priority: "NORMAL", items: 3, createdAt: "2026-03-08T10:30:00Z", shippingAddress: "123 Lagos Road, Lagos" },
  { id: "ORD-002", orderNumber: "ORD-2026-002", customerName: "BuildRight Construction", customerId: "CUST-002", total: 180000, status: "CONFIRMED", priority: "HIGH", items: 2, createdAt: "2026-03-08T09:15:00Z", shippingAddress: "456 Abeokuta Way, Abeokuta" },
  { id: "ORD-003", orderNumber: "ORD-2026-003", customerName: "ABC Supplies Ltd", customerId: "CUST-003", total: 95000, status: "DELIVERED", priority: "NORMAL", items: 1, createdAt: "2026-03-07T14:20:00Z", shippingAddress: "789 Port Harcourt Blvd, PH" },
  { id: "ORD-004", orderNumber: "ORD-2026-004", customerName: "Metro Builders Inc", customerId: "CUST-004", total: 420000, status: "PROCESSING", priority: "HIGH", items: 5, createdAt: "2026-03-07T11:45:00Z", shippingAddress: "321 Enugu St, Enugu" },
  { id: "ORD-005", orderNumber: "ORD-2026-005", customerName: "City Construction", customerId: "CUST-005", total: 150000, status: "PENDING", priority: "NORMAL", items: 2, createdAt: "2026-03-06T16:00:00Z", shippingAddress: "555 Kano Road, Kano" },
  { id: "ORD-006", orderNumber: "ORD-2026-006", customerName: "Doe Cement Distributors", customerId: "CUST-001", total: 380000, status: "IN_TRANSIT", priority: "NORMAL", items: 4, createdAt: "2026-03-06T09:30:00Z", shippingAddress: "123 Lagos Road, Lagos" },
  { id: "ORD-007", orderNumber: "ORD-2026-007", customerName: "Delta Builders", customerId: "CUST-006", total: 72000, status: "CANCELLED", priority: "NORMAL", items: 1, createdAt: "2026-03-05T15:20:00Z", shippingAddress: "777 Asaba Way, Asaba" },
  { id: "ORD-008", orderNumber: "ORD-2026-008", customerName: "BuildRight Construction", customerId: "CUST-002", total: 295000, status: "COMPLETED", priority: "HIGH", items: 3, createdAt: "2026-03-05T10:00:00Z", shippingAddress: "456 Abeokuta Way, Abeokuta" },
];

const priorityConfig: Record<string, { color: string; label: string }> = {
  LOW: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: "Low" },
  NORMAL: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Normal" },
  HIGH: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "High" },
  URGENT: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", label: "Urgent" },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = mockOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage customer orders</p>
        </div>
        <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
              statusFilter === status ? "border-primary ring-2 ring-primary" : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">{status}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
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
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Priority</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <div className="font-medium text-primary">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{order.id}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{order.customerName}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {order.items} items
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityConfig[order.priority]?.color}`}>
                      {priorityConfig[order.priority]?.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-1">
                      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="View Details">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      {order.status !== "DELIVERED" && order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                        <>
                          <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="Update Status">
                            <Truck className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" title="Cancel Order">
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredOrders.length} of {mockOrders.length} orders
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
