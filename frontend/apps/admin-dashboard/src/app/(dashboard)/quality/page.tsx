"use client";

import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, FileText, TrendingUp } from "lucide-react";

const qualityStats = {
 inspectionsToday: 24,
 passed: 22,
 failed: 2,
 ncrOpen: 3,
 capaPending: 1,
 complianceRate: 98.5,
};

const recentInspections = [
 { id:"1", batchNumber:"BATCH-001", product:"Dangote Cement 50kg", result:"PASSED", inspector:"John Doe", date:"2026-03-17T08:00:00Z"},
 { id:"2", batchNumber:"BATCH-002", product:"BUA Cement 50kg", result:"PASSED", inspector:"Jane Smith", date:"2026-03-17T07:30:00Z"},
 { id:"3", batchNumber:"BATCH-003", product:"Lafarge Cement 50kg", result:"FAILED", inspector:"John Doe", date:"2026-03-17T06:00:00Z"},
];

const ncrList = [
 { id:"1", ncrNumber:"NCR-001", description:"Particle size distribution out of spec", severity:"HIGH", status:"OPEN", createdAt:"2026-03-16"},
 { id:"2", ncrNumber:"NCR-002", description:"Packaging seal integrity issue", severity:"MEDIUM", status:"IN_PROGRESS", createdAt:"2026-03-15"},
];

export default function QualityPage() {
 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-bold text-cement-900">Quality & Compliance</h1>
 <p className="text-cement-500">Quality management and compliance tracking.</p>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Inspections Today</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{qualityStats.inspectionsToday}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
 <ShieldCheck className="h-6 w-6 text-blue-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Passed</p>
 <p className="mt-1 text-2xl font-bold text-green-600">{qualityStats.passed}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
 <CheckCircle className="h-6 w-6 text-green-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Failed</p>
 <p className="mt-1 text-2xl font-bold text-red-600">{qualityStats.failed}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
 <XCircle className="h-6 w-6 text-red-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Open NCRs</p>
 <p className="mt-1 text-2xl font-bold text-orange-600">{qualityStats.ncrOpen}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
 <AlertTriangle className="h-6 w-6 text-orange-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">CAPA Pending</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{qualityStats.capaPending}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
 <FileText className="h-6 w-6 text-purple-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Compliance Rate</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{qualityStats.complianceRate}%</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
 <TrendingUp className="h-6 w-6 text-emerald-600"/>
 </div>
 </div>
 </div>
 </div>

 {/* Recent Inspections */}
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Recent Inspections</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Batch</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Product</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Result</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Inspector</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {recentInspections.map((inspection) => (
 <tr key={inspection.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{inspection.batchNumber}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{inspection.product}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 inspection.result ==="PASSED"
 ?"bg-green-100 text-green-800"
 :"bg-red-100 text-red-800"
 }`}
 >
 {inspection.result}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{inspection.inspector}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* NCR List */}
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Non-Conformance Reports</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">NCR Number</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Description</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Severity</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {ncrList.map((ncr) => (
 <tr key={ncr.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{ncr.ncrNumber}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{ncr.description}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 ncr.severity ==="HIGH"
 ?"bg-red-100 text-red-800"
 : ncr.severity ==="MEDIUM"
 ?"bg-yellow-100 text-yellow-800"
 :"bg-blue-100 text-blue-800"
 }`}
 >
 {ncr.severity}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 ncr.status ==="OPEN"
 ?"bg-red-100 text-red-800"
 :"bg-blue-100 text-blue-800"
 }`}
 >
 {ncr.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
