import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  estimatedDelivery: string;
}

export function useOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await ordersApi.list(params);
      return response.data as { data: Order[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await ordersApi.get(id);
      return response.data as Order;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      items: Array<{ productId: string; quantity: number }>;
      deliveryAddress: string;
      deliveryDate?: string;
      paymentMethod: "bank_transfer" | "card" | "ussd";
      notes?: string;
    }) => {
      const response = await ordersApi.create(data);
      return response.data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await ordersApi.cancel(id, reason);
      return response.data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
