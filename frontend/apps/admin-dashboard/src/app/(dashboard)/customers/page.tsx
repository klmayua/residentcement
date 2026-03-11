"use client";

import { useState } from "react";
import { Search, Filter, UserPlus, Download, MoreVertical, Mail, Phone, Building2 } from "lucide-react";
import { api, formatCurrency, formatDate } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const mockCustomers = [
  { id: "CUST-001", name: "Doe Cement Distributors", email: "contact@doecement.com", phone: "+2348012345678", address: "123 Lagos Road, Lagos", tier: "gold", creditLimit: 5000000, outstandingBalance: 1250000, status: "active", totalOrders: 24, createdAt: "2025-06-15" },
  { id: "CUST-002", name: "BuildRight Construction", email: "info@buildright.com", phone: "+2348012345679", address: "456 Abeokuta Way, Abeokuta", tier: "silver", creditLimit: 2500000, outstandingBalance: 450000, status: "active", totalOrders: 18, createdAt: "2025-07-22" },
  { id: "CUST-003", name: "ABC Supplies Ltd", email: "admin@abcsupplies.com", phone: "+2348012345680", address: "789 Port Harcourt Blvd, PH", tier: "bronze", creditLimit: 1000000, outstandingBalance: 0, status: "active", totalOrders: 8, createdAt: "2025-09-10" },
  { id: "CUST-004", name: "Metro Builders Inc", email: "contact@metrobuilders.com", phone: "+2348012345681", address: "321 Enugu St, Enugu", tier: "platinum", creditLimit: 10000000, outstandingBalance: 3200000, status: "active", totalOrders: 42, createdAt: "2025-04-05" },
  { id: "CUST-005", name: "City Construction", email: "projects@cityconstruct.com", phone: "+2348012345682", address: "555 Kano Road, Kano", tier: "gold", creditLimit: 5000000, outstandingBalance: 2100000, status: "active", totalOrders: 31, createdAt: "2025-05-18" },
  { id: "CUST-006", name: "Delta Builders", email: "info@deltabuilders.com", phone: "+2348012345683", address: "777 Asaba Way, Asaba", tier: "silver", creditLimit: 2500000, outstandingBalance: 890000, status: "inactive", totalOrders: 12, createdAt: "2025-08-30" },
];

const tierConfig: Record<string, { color: string; label: string }> = {
  bronze: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", label: "Bronze" },
  silver: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: "Silver" },
  gold: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Gold" },
  platinum: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Platinum" },
};

const statusConfig: Record<string, { variant: string; label: string }> = {
  active: { variant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Active" },
  inactive: { variant: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", label: "Inactive" },
  suspended: { variant: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Suspended" },
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your customer relationships</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Credit Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{customer.id}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="mr-2 h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="mr-2 h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tierConfig[customer.tier]?.color}`}>
                      {tierConfig[customer.tier]?.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(customer.creditLimit)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(customer.outstandingBalance)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {customer.totalOrders}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[customer.status]?.variant}`}>
                      {statusConfig[customer.status]?.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredCustomers.length} of {mockCustomers.length} customers
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
