import { useQuery } from "@tanstack/react-query";
import { productsApi, inventoryApi } from "./api";

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  grade: string;
  category: string;
  basePrice: number;
  unit: string;
  image?: string;
  status: "active" | "inactive" | "discontinued";
  createdAt: string;
  updatedAt: string;
}

export interface ProductAvailability {
  productId: string;
  availableQuantity: number;
  reservedQuantity: number;
  warehouseId: string;
}

// Fetch all products
export async function getProducts(params?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<Product[]> {
  const response = await productsApi.list(params);
  return response.data.products || response.data;
}

// Fetch single product
export async function getProduct(id: string): Promise<Product> {
  const response = await productsApi.get(id);
  return response.data;
}

// Fetch product availability/stock
export async function getProductAvailability(
  id: string
): Promise<ProductAvailability> {
  const response = await productsApi.getAvailability(id);
  return response.data;
}

// Calculate pricing for customer tier
export async function calculatePricing(data: {
  productId: string;
  quantity: number;
  customerId?: string;
}): Promise<{
  basePrice: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  tier?: string;
}> {
  const response = await productsApi.calculate(data);
  return response.data;
}

// React Query hooks
export function useProducts(filters?: {
  category?: string;
  status?: string;
  search?: string;
}) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useProductAvailability(id: string) {
  return useQuery<ProductAvailability>({
    queryKey: ["product-availability", id],
    queryFn: () => getProductAvailability(id),
    enabled: !!id,
  });
}
