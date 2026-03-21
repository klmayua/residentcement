"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Vehicle {
  id: string;
  registration: string;
  type: string;
  capacity: number;
  capacityUnit: string;
  status: string;
  currentLocation?: string;
  driverId?: string;
  driver?: {
    name: string;
    phone: string;
  };
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  vehicle?: Vehicle;
  driverId: string;
  driver?: {
    name: string;
    phone: string;
  };
  status: string;
  startTime?: string;
  endTime?: string;
  totalDistance?: number;
  totalDeliveries: number;
  completedDeliveries: number;
  route?: {
    origin: string;
    destination: string;
    waypoints?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  orderId: string;
  order?: {
    orderNumber: string;
  };
  customerId: string;
  customer?: {
    name: string;
    address: string;
  };
  tripId?: string;
  trip?: Trip;
  status: string;
  scheduledDate?: string;
  deliveredAt?: string;
  recipientName?: string;
  recipientPhone?: string;
  notes?: string;
  signatureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetResponse {
  data: Vehicle[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

export interface TripsResponse {
  data: Trip[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

export interface DeliveriesResponse {
  data: Delivery[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
}

// Get fleet/vehicles
export function useFleet(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  return useQuery<FleetResponse>({
    queryKey: ["fleet", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.type) queryParams.append("type", params.type);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/vehicles?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch fleet");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get trips
export function useTrips(params?: {
  page?: number;
  limit?: number;
  status?: string;
  vehicleId?: string;
}) {
  return useQuery<TripsResponse>({
    queryKey: ["trips", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.vehicleId) queryParams.append("vehicleId", params.vehicleId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/trips?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch trips");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get deliveries
export function useDeliveries(params?: {
  page?: number;
  limit?: number;
  status?: string;
  tripId?: string;
  date?: string;
}) {
  return useQuery<DeliveriesResponse>({
    queryKey: ["deliveries", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.tripId) queryParams.append("tripId", params.tripId);
      if (params?.date) queryParams.append("date", params.date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/deliveries?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch deliveries");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get logistics dashboard stats
export function useLogisticsStats() {
  return useQuery<{
    data: {
      activeTrips: number;
      vehiclesAvailable: number;
      driversOnDuty: number;
      deliveriesToday: number;
      pendingDeliveries: number;
      completionRate: number;
    };
  }>({
    queryKey: ["logistics-stats"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch logistics stats");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Create trip
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      vehicleId: string;
      driverId: string;
      route: {
        origin: string;
        destination: string;
        waypoints?: string[];
      };
      deliveryIds?: string[];
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/trips`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to create trip");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["logistics-stats"] });
    },
  });
}

// Update trip status
export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/trips/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update trip status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["logistics-stats"] });
    },
  });
}

// Update delivery status
export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
      recipientName,
      recipientPhone,
    }: {
      id: string;
      status: string;
      notes?: string;
      recipientName?: string;
      recipientPhone?: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/logistics/deliveries/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, notes, recipientName, recipientPhone }),
        }
      );
      if (!response.ok) throw new Error("Failed to update delivery status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["logistics-stats"] });
    },
  });
}
