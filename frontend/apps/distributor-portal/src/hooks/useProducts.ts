import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  grade: string;
  unit: string;
  unitSize: number;
  basePrice: number;
  currency: string;
  stockLevel: number;
  reorderPoint: number;
  status: string;
  imageUrl: string;
}

export interface ProductAvailability {
  productId: string;
  productName: string;
  availableStock: number;
  reorderPoint: number;
  status: "in_stock" | "low_stock";
  lastUpdated: string;
}

export function useProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  grade?: string;
  inStock?: boolean;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await productsApi.list(params);
      return response.data as { data: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productsApi.get(id);
      return response.data as Product;
    },
    enabled: !!id,
  });
}

export function useProductAvailability(id: string) {
  return useQuery({
    queryKey: ["product-availability", id],
    queryFn: async () => {
      const response = await productsApi.getAvailability(id);
      return response.data as ProductAvailability;
    },
    enabled: !!id,
    refetchInterval: 30000,
  });
}
