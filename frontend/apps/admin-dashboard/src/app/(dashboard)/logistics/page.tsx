"use client";

import { useState } from "react";
import { Truck, MapPin, Users, Package, Clock, CheckCircle, Loader2, Search } from "lucide-react";
import { useFleet, useTrips, useLogisticsStats } from "@/hooks/useLogistics";
import { getStatusColor } from "@/lib/api";

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<"trips" | "fleet">("trips");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch data from APIs
  const { data: statsData, isLoading: statsLoading } = useLogisticsStats();
  const { data: tripsData, isLoading: tripsLoading } = useTrips({
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const { data: fleetData, isLoading: fleetLoading } = useFleet({
    page: 1,
    limit: 100,
  });

  const stats = statsData?.data || {
    activeTrips: 0,
    vehiclesAvailable: 0,
    driversOnDuty: 0,
    deliveriesToday: 0,
    pendingDeliveries: 0,
    completionRate: 0,
  };
  const trips = tripsData?.data || [];
  const fleet = fleetData?.data || [];
  const pagination = tripsData?.meta?.pagination;

  const isLoading = statsLoading || tripsLoading || fleetLoading;

  // Filter trips client-side for search
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.vehicle?.registration || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.driver?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter fleet client-side for search
  const filteredFleet = fleet.filter((vehicle) => {
    const matchesSearch =
      vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.currentLocation || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logistics & Fleet Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Track deliveries, manage fleet, and monitor routes.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Trips</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : stats.activeTrips}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicles Available</p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {isLoading ? "..." : stats.vehiclesAvailable}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Drivers On Duty</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : stats.driversOnDuty}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Deliveries Today</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : stats.deliveriesToday}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Deliveries</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {isLoading ? "..." : stats.pendingDeliveries}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {isLoading ? "..." : `${stats.completionRate}%`}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("trips")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "trips"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Trips
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "fleet"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Fleet Status
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "trips" ? "Search trips..." : "Search fleet..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="flex space-x-2">
          {activeTab === "trips" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* Active Trips */}
      {activeTab === "trips" ? (
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Trip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tripsLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => {
                    const progress = trip.totalDeliveries > 0
                      ? Math.round((trip.completedDeliveries / trip.totalDeliveries) * 100)
                      : 0;
                    return (
                      <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{trip.tripNumber}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {trip.vehicle?.registration || "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {trip.driver?.name || "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(trip.status)}`}
                          >
                            {trip.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-2 w-24 rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{progress}%</span>
                          </div>
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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * pagination.limit + 1} -{" "}
                {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} trips
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
        /* Fleet Status */
        <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {fleetLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </td>
                  </tr>
                ) : filteredFleet.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No vehicles found
                    </td>
                  </tr>
                ) : (
                  filteredFleet.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{vehicle.registration}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{vehicle.type.replace("_", " ")}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {vehicle.capacity} {vehicle.capacityUnit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            vehicle.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : vehicle.status === "IN_USE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {vehicle.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {vehicle.currentLocation || "Unknown"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
