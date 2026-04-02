"use client";

import { useState } from "react";
import { MapPin, Navigation, Truck, Clock, Phone } from "lucide-react";

interface VehicleLocation {
  id: string;
  registration: string;
  driver: string;
  status: string;
  latitude: number;
  longitude: number;
  lastUpdate: string;
  speed: number;
  heading: string;
}

const mockLocations: VehicleLocation[] = [
  {
    id: "1",
    registration: "LAG-123-ABC",
    driver: "John Doe",
    status: "IN_TRANSIT",
    latitude: 6.5244,
    longitude: 3.3792,
    lastUpdate: "2 mins ago",
    speed: 45,
    heading: "NE",
  },
  {
    id: "2",
    registration: "LAG-456-DEF",
    driver: "Jane Smith",
    status: "IDLE",
    latitude: 6.45,
    longitude: 3.4,
    lastUpdate: "5 mins ago",
    speed: 0,
    heading: "N",
  },
];

export default function TrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cement-900">Live Vehicle Tracking</h1>
        <p className="text-cement-500">Real-time GPS tracking of fleet vehicles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-cement-900">Active Vehicles</h3>
            </div>
            <div className="divide-y divide-cement-200">
              {mockLocations.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`w-full p-4 text-left hover:bg-cement-50 transition-colors ${
                    selectedVehicle?.id === vehicle.id ? "bg-cement-50 border-l-4 border-brand-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-cement-400 mr-3" />
                      <div>
                        <p className="font-medium text-cement-900">{vehicle.registration}</p>
                        <p className="text-sm text-cement-500">{vehicle.driver}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        vehicle.status === "IN_TRANSIT"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-cement-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {vehicle.lastUpdate}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Vehicle Details */}
          {selectedVehicle && (
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h4 className="font-semibold text-cement-900 mb-3">Vehicle Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cement-500">Speed</span>
                  <span className="font-medium">{selectedVehicle.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cement-500">Heading</span>
                  <span className="font-medium">{selectedVehicle.heading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cement-500">Coordinates</span>
                  <span className="font-medium text-xs">
                    {selectedVehicle.latitude.toFixed(4)}, {selectedVehicle.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90">
                <Phone className="h-4 w-4" />
                Contact Driver
              </button>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white shadow-sm h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-cement-100 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-cement-400 mx-auto mb-4" />
                <p className="text-cement-600 font-medium">Interactive Map</p>
                <p className="text-sm text-cement-500 mt-1">
                  Real-time vehicle locations would be displayed here
                </p>
                <p className="text-xs text-cement-400 mt-4">
                  Integration with Mapbox/Google Maps required
                </p>
              </div>
            </div>
            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="p-2 bg-white rounded-lg shadow-md hover:bg-cement-50">
                <MapPin className="h-5 w-5 text-cement-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
