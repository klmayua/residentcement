"use client";

import { useState } from "react";
import {
  Truck,
  Route,
  Calendar,
  MapPin,
  Package,
  Plus,
  CheckCircle,
} from "lucide-react";

interface Trip {
  id: string;
  tripNumber: string;
  vehicle: string;
  driver: string;
  status: string;
  scheduledDate: string;
  deliveries: number;
  startLocation: string;
  endLocation: string;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    tripNumber: "TRIP-20260402-001",
    vehicle: "LAG-123-ABC",
    driver: "John Doe",
    status: "SCHEDULED",
    scheduledDate: "2026-04-02",
    deliveries: 5,
    startLocation: "Warehouse A",
    endLocation: "Ikeja District",
  },
  {
    id: "2",
    tripNumber: "TRIP-20260402-002",
    vehicle: "LAG-456-DEF",
    driver: "Jane Smith",
    status: "IN_PROGRESS",
    scheduledDate: "2026-04-02",
    deliveries: 3,
    startLocation: "Warehouse A",
    endLocation: "Yaba District",
  },
];

export default function DispatchPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Dispatch Planning</h1>
          <p className="text-cement-500">Schedule trips, assign drivers, and optimize routes.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Trip
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cement-900">Today's Schedule</h2>
            <div className="flex items-center gap-2 text-sm text-cement-500">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Trip</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Vehicle/Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Deliveries</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-cement-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-cement-400 mr-3" />
                      <span className="text-sm font-medium text-brand-primary">{trip.tripNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-cement-900">{trip.vehicle}</p>
                      <p className="text-xs text-cement-500">{trip.driver}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-cement-900">
                      <MapPin className="h-4 w-4 text-cement-400 mr-1" />
                      {trip.startLocation} → {trip.endLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-cement-400 mr-1" />
                      <span className="text-sm">{trip.deliveries} stops</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        trip.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : trip.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : trip.status === "SCHEDULED"
                          ? "bg-cement-100 text-cement-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-brand-primary hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Optimization */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-cement-900 mb-4">Route Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-cement-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Route className="h-5 w-5 text-brand-primary" />
              <span className="font-medium text-cement-900">Suggested Routes</span>
            </div>
            <p className="text-sm text-cement-600">3 optimized routes available for tomorrow</p>
          </div>
          <div className="p-4 bg-cement-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-cement-900">Auto-Assign</span>
            </div>
            <p className="text-sm text-cement-600">Match drivers to routes automatically</p>
          </div>
          <div className="p-4 bg-cement-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-cement-900">Load Optimization</span>
            </div>
            <p className="text-sm text-cement-600">Balance deliveries across fleet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
