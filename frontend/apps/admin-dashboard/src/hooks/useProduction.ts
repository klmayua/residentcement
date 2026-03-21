"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  product?: {
    name: string;
    sku: string;
  };
  quantity: number;
  unitOfMeasure: string;
  status: string;
  priority: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  createdById: string;
  createdBy?: {
    name: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  productionOrderId?: string;
  productionOrder?: ProductionOrder;
  productId: string;
  product?: {
    name: string;
    sku: string;
  };
  quantity: number;
  unitOfMeasure: string;
  status: string;
  qualityStatus: string;
  startedAt?: string;
  completedAt?: string;
  qualityCheckAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  capacity?: number;
  capacityUnit?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  lastMaintenance?: string;
  nextMaintenanceDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionResponse {
  data: ProductionOrder[];
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

export interface BatchesResponse {
  data: Batch[];
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

export interface EquipmentResponse {
  data: Equipment[];
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

// Get production orders
export function useProductionOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}) {
  return useQuery<ProductionResponse>({
    queryKey: ["production-orders", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.priority) queryParams.append("priority", params.priority);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/orders?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch production orders");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get batches
export function useBatches(params?: {
  page?: number;
  limit?: number;
  status?: string;
  qualityStatus?: string;
}) {
  return useQuery<BatchesResponse>({
    queryKey: ["batches", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.qualityStatus) queryParams.append("qualityStatus", params.qualityStatus);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/batches?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch batches");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get equipment
export function useEquipment(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  return useQuery<EquipmentResponse>({
    queryKey: ["equipment", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.type) queryParams.append("type", params.type);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/equipment?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch equipment");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get production dashboard stats
export function useProductionStats() {
  return useQuery<{
    data: {
      activeOrders: number;
      completedToday: number;
      pendingBatches: number;
      qualityIssues: number;
      efficiency: number;
      uptime: number;
    };
  }>({
    queryKey: ["production-stats"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch production stats");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Create production order
export function useCreateProductionOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: string;
      quantity: number;
      priority?: string;
      plannedStartDate?: string;
      plannedEndDate?: string;
      notes?: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to create production order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-orders"] });
      queryClient.invalidateQueries({ queryKey: ["production-stats"] });
    },
  });
}

// Update batch status
export function useUpdateBatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/batches/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update batch status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["production-stats"] });
    },
  });
}

// Update equipment status
export function useUpdateEquipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/production/equipment/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update equipment status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["production-stats"] });
    },
  });
}
