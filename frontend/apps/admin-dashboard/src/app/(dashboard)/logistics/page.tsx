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
 { id:"1", tripNumber:"TRIP-001", vehicle:"LAG-123-ABC", driver:"John Doe", status:"IN_PROGRESS", deliveries: 5, progress: 60 },
 { id:"2", tripNumber:"TRIP-002", vehicle:"LAG-456-DEF", driver:"Jane Smith", status:"IN_PROGRESS", deliveries: 3, progress: 40 },
 { id:"3", tripNumber:"TRIP-003", vehicle:"LAG-789-GHI", driver:"Mike Johnson", status:"SCHEDULED", deliveries: 4, progress: 0 },
];

const fleetStatus = [
 { id:"1", registration:"LAG-123-ABC", type:"TRUCK_MEDIUM", capacity:"5000kg", status:"IN_USE", location:"Ikeja, Lagos"},
 { id:"2", registration:"LAG-456-DEF", type:"TRUCK_LARGE", capacity:"10000kg", status:"IN_USE", location:"Yaba, Lagos"},
 { id:"3", registration:"LAG-789-GHI", type:"TRUCK_SMALL", capacity:"3000kg", status:"AVAILABLE", location:"Warehouse A"},
 { id:"4", registration:"LAG-321-JKL", type:"VAN", capacity:"1500kg", status:"AVAILABLE", location:"Warehouse A"},
];

export default function LogisticsPage() {
 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-bold text-cement-900">Logistics & Fleet Management</h1>
 <p className="text-cement-500">Track deliveries, manage fleet, and monitor routes.</p>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Active Trips</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{logisticsStats.activeTrips}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
 <Truck className="h-6 w-6 text-blue-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Vehicles Available</p>
 <p className="mt-1 text-2xl font-bold text-green-600">{logisticsStats.vehiclesAvailable}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
 <MapPin className="h-6 w-6 text-green-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Drivers On Duty</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{logisticsStats.driversOnDuty}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
 <Users className="h-6 w-6 text-purple-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Deliveries Today</p>
 <p className="mt-1 text-2xl font-bold text-cement-900">{logisticsStats.deliveriesToday}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
 <Package className="h-6 w-6 text-orange-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Pending Deliveries</p>
 <p className="mt-1 text-2xl font-bold text-yellow-600">{logisticsStats.pendingDeliveries}</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
 <Clock className="h-6 w-6 text-yellow-600"/>
 </div>
 </div>
 </div>

 <div className="rounded-xl border bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-cement-500">Completion Rate</p>
 <p className="mt-1 text-2xl font-bold text-emerald-600">{logisticsStats.completedRate}%</p>
 </div>
 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
 <CheckCircle className="h-6 w-6 text-emerald-600"/>
 </div>
 </div>
 </div>
 </div>

 {/* Active Trips */}
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Active Trips</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Trip</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Vehicle</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Driver</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Progress</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {activeTrips.map((trip) => (
 <tr key={trip.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">{trip.tripNumber}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{trip.vehicle}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{trip.driver}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 trip.status ==="IN_PROGRESS"
 ?"bg-blue-100 text-blue-800"
 :"bg-cement-100 text-cement-800"
 }`}
 >
 {trip.status}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4">
 <div className="flex items-center">
 <div className="h-2 w-24 rounded-full bg-cement-200">
 <div
 className="h-2 rounded-full bg-primary"
 style={{ width: `${trip.progress}%` }}
 />
 </div>
 <span className="ml-2 text-sm text-cement-600">{trip.progress}%</span>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Fleet Status */}
 <div className="rounded-xl border bg-white shadow-sm">
 <div className="flex items-center justify-between border-b p-6">
 <h2 className="text-lg font-semibold text-cement-900">Fleet Status</h2>
 <button className="text-sm font-medium text-primary hover:underline">View All</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-cement-50">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Registration</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Type</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Capacity</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Status</th>
 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cement-500">Location</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-cement-200">
 {fleetStatus.map((vehicle) => (
 <tr key={vehicle.id} className="hover:bg-cement-50">
 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-cement-900">{vehicle.registration}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{vehicle.type}</td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-900">{vehicle.capacity}</td>
 <td className="whitespace-nowrap px-6 py-4">
 <span
 className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
 vehicle.status ==="AVAILABLE"
 ?"bg-green-100 text-green-800"
 : vehicle.status ==="IN_USE"
 ?"bg-blue-100 text-blue-800"
 :"bg-yellow-100 text-yellow-800"
 }`}
 >
 {vehicle.status}
 </span>
 </td>
 <td className="whitespace-nowrap px-6 py-4 text-sm text-cement-500">{vehicle.location}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
