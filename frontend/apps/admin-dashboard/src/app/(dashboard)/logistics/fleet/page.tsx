"use client";

import { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Wrench,
  Edit,
  Trash2,
} from "lucide-react";

interface Vehicle {
  id: string;
  registration: string;
  type: string;
  make: string;
  model: string;
  year: number;
  capacityKg: number;
  status: string;
  currentLocation?: string;
  driverName?: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registration: "LAG-123-ABC",
    type: "TRUCK_MEDIUM",
    make: "Isuzu",
    model: "FVR 900",
    year: 2022,
    capacityKg: 8000,
    status: "IN_USE",
    currentLocation: "Ikeja, Lagos",
    driverName: "John Doe",
  },
  {
    id: "2",
    registration: "LAG-456-DEF",
    type: "TRUCK_LARGE",
    make: "Mercedes",
    model: "Actros 2644",
    year: 2021,
    capacityKg: 15000,
    status: "AVAILABLE",
    currentLocation: "Warehouse A",
  },
  {
    id: "3",
    registration: "LAG-789-GHI",
    type: "TRUCK_SMALL",
    make: "Toyota",
    model: "Dyna",
    year: 2023,
    capacityKg: 3500,
    status: "UNDER_MAINTENANCE",
    currentLocation: "Service Center",
  },
];

const vehicleTypes = [
  { value: "TRUCK_SMALL", label: "Small Truck (3-5 tons)" },
  { value: "TRUCK_MEDIUM", label: "Medium Truck (5-10 tons)" },
  { value: "TRUCK_LARGE", label: "Large Truck (10-20 tons)" },
  { value: "TRUCK_HEAVY", label: "Heavy Duty (20+ tons)" },
  { value: "VAN", label: "Van" },
];

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "AVAILABLE").length,
    inUse: vehicles.filter((v) => v.status === "IN_USE").length,
    maintenance: vehicles.filter((v) => v.status === "UNDER_MAINTENANCE").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cement-900">Fleet Management</h1>
          <p className="text-cement-500">Manage vehicles, track locations, and schedule maintenance.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Total Vehicles</p>
          <p className="mt-1 text-2xl font-bold text-cement-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Available</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{stats.available}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">In Use</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{stats.inUse}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-cement-500">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-cement-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="IN_USE">In Use</option>
          <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>
      </div>

      {/* Vehicles Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cement-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-cement-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-cement-50">
                  <td className="px-6 py-4 text-sm font-medium text-cement-900">{vehicle.registration}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-cement-900">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-cement-500">{vehicle.year}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-900">{vehicle.type}</td>
                  <td className="px-6 py-4 text-sm text-cement-900">{(vehicle.capacityKg / 1000).toFixed(1)} tons</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vehicle.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : vehicle.status === "IN_USE"
                          ? "bg-blue-100 text-blue-800"
                          : vehicle.status === "UNDER_MAINTENANCE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cement-500">{vehicle.currentLocation || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-cement-400 hover:text-brand-primary" title="Track">
                        <MapPin className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-cement-400 hover:text-brand-primary" title="Maintenance">
                        <Wrench className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-cement-400 hover:text-brand-primary" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
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
