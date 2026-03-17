"use client";

import { Truck, MapPin, Users, Package, Clock, CheckCircle } from "lucide-react";

const logisticsStats = {
  activeTrips: 8,
  vehiclesAvailable: 12,
  driversOnDuty: 15,
  deliveriesToday: 45,
  pendingDeliveries: 12,
  completedRate: 94,
};

const activeTrips = [
  { id: "1", tripNumber: "TRIP-001", vehicle: "LAG-123-ABC", driver: "John Doe", status: "IN_PROGRESS", deliveries: 5, progress: 60 },
  { id: "2", tripNumber: "TRIP-002", vehicle: "LAG-456-DEF", driver: "Jane Smith", status: "IN_PROGRESS", deliveries: 3, progress: 40 },
  { id: "3", tripNumber: "TRIP-003", vehicle: "LAG-789-GHI", driver: "Mike Johnson", status: "SCHEDULED", deliveries: 4, progress: 0 },
];

const fleetStatus = [
  { id: "1", registration: "LAG-123-ABC", type: "TRUCK_MEDIUM", capacity: "5000kg", status: "IN_USE", location: "Ikeja, Lagos" },
  { id: "2", registration: "LAG-456-DEF", type: "TRUCK_LARGE", capacity: "10000kg", status: "IN_USE", location: "Yaba, Lagos" },
  { id: "3", registration: "LAG-789-GHI", type: "TRUCK_SMALL", capacity: "3000kg", status: "AVAILABLE", location: "Warehouse A" },
  { id: "4", registration: "LAG-321-JKL", type: "VAN", capacity: "1500kg", status: "AVAILABLE", location: "Warehouse A" },
];

export default function LogisticsPage() {
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
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{logisticsStats.activeTrips}</p>
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
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{logisticsStats.vehiclesAvailable}</p>
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
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{logisticsStats.driversOnDuty}</p>
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
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{logisticsStats.deliveriesToday}</p>
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
              <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{logisticsStats.pendingDeliveries}</p>
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
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{logisticsStats.completedRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Trips */}
      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Trips</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
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
              {activeTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{trip.tripNumber}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{trip.vehicle}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{trip.driver}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        trip.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${trip.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{trip.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Status */}
      <div className="rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fleet Status</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
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
              {fleetStatus.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{vehicle.registration}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{vehicle.type}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{vehicle.capacity}</td>
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
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{vehicle.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
