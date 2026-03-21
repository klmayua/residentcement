"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  status: string;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  product?: {
    name: string;
    sku: string;
  };
  warehouse?: {
    name: string;
    code: string;
  };
}

export interface InventoryResponse {
  data: InventoryItem[];
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

export interface WarehousesResponse {
  data: Warehouse[];
}

// Get inventory with pagination and filters
export function useInventory(params?: {
  page?: number;
  limit?: number;
  productId?: string;
  warehouseId?: string;
  status?: string;
}) {
  return useQuery<InventoryResponse>({
    queryKey: ["inventory", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.productId) queryParams.append("productId", params.productId);
      if (params?.warehouseId) queryParams.append("warehouseId", params.warehouseId);
      if (params?.status) queryParams.append("status", params.status);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/inventory?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds - inventory changes frequently
  });
}

// Get low stock items
export function useLowStock(threshold?: number) {
  return useQuery<InventoryResponse>({
    queryKey: ["inventory", "low-stock", threshold],
    queryFn: async () => {
      const queryParams = threshold ? `?threshold=${threshold}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/inventory/low-stock${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch low stock items");
      return response.json();
    },
    staleTime: 60 * 1000,
  });
}

// Get warehouses
export function useWarehouses() {
  return useQuery<WarehousesResponse>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/warehouses`
      );
      if (!response.ok) throw new Error("Failed to fetch warehouses");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - warehouses don't change often
  });
}

// Get single warehouse
export function useWarehouse(id: string) {
  return useQuery<{ data: Warehouse & { inventory: InventoryItem[] } }>({
    queryKey: ["warehouse", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/warehouses/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch warehouse");
      return response.json();
    },
    enabled: !!id,
  });
}

// Reserve inventory
export function useReserveInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: string;
      warehouseId: string;
      quantity: number;
      orderId: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/inventory/reserve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to reserve inventory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

// Release reserved inventory
export function useReleaseInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { inventoryId: string; quantity: number }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/inventory/release`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to release inventory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

// Update inventory quantity
export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { quantity: number } }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/inventory/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to update inventory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
