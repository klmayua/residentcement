"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, FileText, TrendingUp, Loader2, Search } from "lucide-react";
import { useInspections, useNCRs, useQualityStats } from "@/hooks/useQuality";
import { formatDate } from "@/lib/api";

export default function QualityPage() {
  const [activeTab, setActiveTab] = useState<"inspections" | "ncrs">("inspections");
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch data from APIs
  const { data: statsData, isLoading: statsLoading } = useQualityStats();
  const { data: inspectionsData, isLoading: inspectionsLoading } = useInspections({
    page,
    limit: 10,
    result: resultFilter !== "all" ? resultFilter : undefined,
  });
  const { data: ncrsData, isLoading: ncrsLoading } = useNCRs({
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const stats = statsData?.data || {
    inspectionsToday: 0,
    passed: 0,
    failed: 0,
    ncrOpen: 0,
    capaPending: 0,
    complianceRate: 0,
  };
  const inspections = inspectionsData?.data || [];
  const ncrs = ncrsData?.data || [];
  const pagination = activeTab === "inspections" ? inspectionsData?.meta?.pagination : ncrsData?.meta?.pagination;

  const isLoading = statsLoading || inspectionsLoading || ncrsLoading;

  // Filter inspections client-side for search
  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inspection.batch?.batchNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inspection.product?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter NCRs client-side for search
  const filteredNCRs = ncrs.filter((ncr) => {
    const matchesSearch =
      ncr.ncrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ncr.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quality & Compliance</h1>
        <p className="text-gray-500 dark:text-gray-400">Quality management and compliance tracking.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inspections Today</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : stats.inspectionsToday}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passed</p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {isLoading ? "..." : stats.passed}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {isLoading ? "..." : stats.failed}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open NCRs</p>
              <p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
                {isLoading ? "..." : stats.ncrOpen}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CAPA Pending</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : stats.capaPending}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : `${stats.complianceRate}%`}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("inspections")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "inspections"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Recent Inspections
          </button>
          <button
            onClick={() => setActiveTab("ncrs")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "ncrs"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Non-Conformance Reports
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "inspections" ? "Search inspections..." : "Search NCRs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          {activeTab === "inspections" ? (
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Results</option>
              <option value="PASSED">Passed</option>
              <option value="FAILED">Failed</option>
            </select>
          ) : (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          )}
        </div>
      </div>

      {/* Recent Inspections */}
      {activeTab === "inspections" ? (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Inspector</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {inspectionsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No inspections found
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((inspection) => (
                    <tr key={inspection.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">
                        {inspection.batch?.batchNumber || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {inspection.product?.name || "Unknown"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {inspection.type.replace("_", " ")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            inspection.result === "PASSED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inspection.result}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {inspection.inspector?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(inspection.inspectionDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && activeTab === "inspections" && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * pagination.limit + 1} -{" "}
                {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} inspections
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => (pagination.hasMore ? p + 1 : p))}
                  disabled={!pagination.hasMore}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* NCR List */
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">NCR Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {ncrsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : filteredNCRs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No NCRs found
                    </td>
                  </tr>
                ) : (
                  filteredNCRs.map((ncr) => (
                    <tr key={ncr.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{ncr.ncrNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">{ncr.description}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ncr.severity === "HIGH"
                              ? "bg-red-100 text-red-800"
                              : ncr.severity === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ncr.severity}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ncr.status === "OPEN"
                              ? "bg-red-100 text-red-800"
                              : ncr.status === "IN_PROGRESS"
                              ? "bg-yellow-100 text-yellow-800"
                              : ncr.status === "CLOSED"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ncr.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {ncr.reportedBy?.name || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(ncr.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && activeTab === "ncrs" && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * pagination.limit + 1} -{" "}
                {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} NCRs
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => (pagination.hasMore ? p + 1 : p))}
                  disabled={!pagination.hasMore}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
