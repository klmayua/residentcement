"use client";

import { useQuery } from "@tanstack/react-query";
import { Factory, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

// Mock data for production metrics
const productionStats = {
  activeOrders: 12,
  completedToday: 45,
  pendingBatches: 8,
  qualityIssues: 2,
  efficiency: 94.5,
  uptime: 98.2,
};

const recentBatches = [
  { id: "1", batchNumber: "BATCH-001", product: "Dangote Cement 50kg", quantity: 1000, status: "COMPLETED", completedAt: "2026-03-17T08:00:00Z" },
  { id: "2", batchNumber: "BATCH-002", product: "BUA Cement 50kg", quantity: 800, status: "IN_PROGRESS", startedAt: "2026-03-17T06:00:00Z" },
  { id: "3", batchNumber: "BATCH-003", product: "Lafarge Cement 50kg", quantity: 1200, status: "SCHEDULED", scheduledFor: "2026-03-17T10:00:00Z" },
  { id: "4", batchNumber: "BATCH-004", product: "Dangote Cement 25kg", quantity: 500, status: "QUALITY_CHECK", completedAt: "2026-03-17T07:30:00Z" },
];

const equipmentStatus = [
  { id: "1", name: "Kiln 1", type: "Rotary Kiln", status: "OPERATIONAL", lastMaintenance: "2026-03-10" },
  { id: "2", name: "Mill 1", type: "Cement Mill", status: "OPERATIONAL", lastMaintenance: "2026-03-12" },
  { id: "3", name: "Packer 1", type: "Packing Machine", status: "MAINTENANCE", lastMaintenance: "2026-03-17" },
  { id: "4", name: "Crusher 1", type: "Limestone Crusher", status: "OPERATIONAL", lastMaintenance: "2026-03-08" },
];

export default function ProductionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Production Monitoring</h1>
        <p className="text-gray-500 dark:text-gray-400">Real-time manufacturing execution system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Production Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{productionStats.activeOrders}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Factory className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Today</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{productionStats.completedToday}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Batches</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{productionStats.pendingBatches}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quality Issues</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{productionStats.qualityIssues}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{productionStats.efficiency}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plant Uptime</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{productionStats.uptime}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Batches</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{batch.batchNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{batch.product}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{batch.quantity.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        batch.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : batch.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : batch.status === "QUALITY_CHECK"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment Status</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {equipmentStatus.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{equipment.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{equipment.type}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        equipment.status === "OPERATIONAL"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {equipment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{equipment.lastMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
