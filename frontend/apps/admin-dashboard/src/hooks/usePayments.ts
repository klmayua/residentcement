"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Payment {
  id: string;
  paymentReference: string;
  orderId?: string;
  order?: {
    orderNumber: string;
  };
  customerId: string;
  customer?: {
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  method: string;
  status: string;
  provider?: string;
  providerReference?: string;
  metadata?: Record<string, unknown>;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsResponse {
  data: Payment[];
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

// Get payments with pagination and filters
export function usePayments(params?: {
  page?: number;
  limit?: number;
  orderId?: string;
  customerId?: string;
  status?: string;
  method?: string;
}) {
  return useQuery<PaymentsResponse>({
    queryKey: ["payments", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.orderId) queryParams.append("orderId", params.orderId);
      if (params?.customerId) queryParams.append("customerId", params.customerId);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.method) queryParams.append("method", params.method);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/payments?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
    staleTime: 60 * 1000,
  });
}

// Get single payment
export function usePayment(id: string) {
  return useQuery<{ data: Payment }>({
    queryKey: ["payment", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/payments/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch payment");
      return response.json();
    },
    enabled: !!id,
  });
}

// Initiate payment
export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      orderId?: string;
      amount: number;
      currency?: string;
      method: string;
      metadata?: Record<string, unknown>;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/payments/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to initiate payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// Verify payment
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/payments/verify/${reference}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to verify payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// Calculate payment stats
export function usePaymentStats() {
  return useQuery<{
    data: {
      total: number;
      totalAmount: number;
      byStatus: { status: string; count: number; amount: number }[];
    };
  }>({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      // Aggregate from payments list
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/payments?limit=1000`
      );
      if (!response.ok) throw new Error("Failed to fetch payment stats");
      const data = await response.json();

      const payments = data.data || [];
      const byStatus = payments.reduce((acc: Record<string, { count: number; amount: number }>, payment: Payment) => {
        if (!acc[payment.status]) {
          acc[payment.status] = { count: 0, amount: 0 };
        }
        acc[payment.status].count++;
        acc[payment.status].amount += payment.amount;
        return acc;
      }, {});

      return {
        data: {
          total: payments.length,
          totalAmount: payments.reduce((sum: number, p: Payment) => sum + p.amount, 0),
          byStatus: Object.entries(byStatus).map(([status, stats]: [string, any]) => ({
            status,
            count: (stats as any).count,
            amount: (stats as any).amount,
          })),
        },
      };
    },
    staleTime: 60 * 1000,
  });
}
