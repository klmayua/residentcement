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
 { id:"1", batchNumber:"BATCH-001", product:"Dangote Cement 50kg", quantity: 1000, status:"COMPLETED", completedAt:"2026-03-17T08:00:00Z"},
 { id:"2", batchNumber:"BATCH-002", product:"BUA Cement 50kg", quantity: 800, status:"IN_PROGRESS", startedAt:"2026-03-17T06:00:00Z"},
 { id:"3", batchNumber:"BATCH-003", product:"Lafarge Cement 50kg", quantity: 1200, status:"SCHEDULED", scheduledFor:"2026-03-17T10:00:00Z"},
 { id:"4", batchNumber:"BATCH-004", product:"Dangote Cement 25kg", quantity: 500, status:"QUALITY_CHECK", completedAt:"2026-03-17T07:30:00Z"},
];

const equipmentStatus = [
 { id:"1", name:"Kiln 1", type:"Rotary Kiln", status:"OPERATIONAL", lastMaintenance:"2026-03-10"},
 { id:"2", name:"Mill 1", type:"Cement Mill", status:"OPERATIONAL", lastMaintenance:"2026-03-12"},
 { id:"3", name:"Packer 1", type:"Packing Machine", status:"MAINTENANCE", lastMaintenance:"2026-03-17"},
 { id:"4", name:"Crusher 1", type:"Limestone Crusher", status:"OPERATIONAL", lastMaintenance:"2026-03-08"},
];

export default function ProductionPage() {
 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-bold text-cement-900">Production Monitoring</h1>
 <p className="text-cement-500">Real-time manufacturing execution system overview.</p>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Active Production Orders</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{productionStats.activeOrders}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
 <Factory className="h-6 w-6 text-blue-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Completed Today</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{productionStats.completedToday}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
 <CheckCircle className="h-6 w-6 text-green-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Pending Batches</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{productionStats.pendingBatches}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
 <Clock className="h-6 w-6 text-yellow-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Quality Issues</p>
 <p className="mt-1 text-2xl font-bold text-red-600">{productionStats.qualityIssues}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
 <AlertTriangle className="h-6 w-6 text-red-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Efficiency Rate</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{productionStats.efficiency}%</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
 <TrendingUp className="h-6 w-6 text-purple-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Plant Uptime</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{productionStats.uptime}%</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
 <Calendar className="h-6 w-6 text-emerald-600"/>
 </div>
 </div>
 </div>
 </div>

 {/* Recent Batches */}
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Recent Batches</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Batch</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Product</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Quantity</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {recentBatches.map((batch) => (
 <tr key={batch.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{batch.batchNumber}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{batch.product}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{batch.quantity.toLocaleString()}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 batch.status ==="COMPLETED"
 ?"bg-green-100 text-green-800"
 : batch.status ==="IN_PROGRESS"
 ?"bg-blue-100 text-blue-800"
 : batch.status ==="QUALITY_CHECK"
 ?"bg-yellow-100 text-yellow-800"
 :"bg-cement-100 text-cement-800"
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
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Equipment Status</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Equipment</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Type</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Last Maintenance</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {equipmentStatus.map((equipment) => (
 <tr key={equipment.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-cement-900">{equipment.name}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{equipment.type}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 equipment.status ==="OPERATIONAL"
 ?"bg-green-100 text-green-800"
 :"bg-yellow-100 text-yellow-800"
 }`}
 >
 {equipment.status}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-500">{equipment.lastMaintenance}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
