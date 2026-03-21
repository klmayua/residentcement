"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "./api";
import { toast } from "sonner";

interface PaymentInitializeRequest {
  amount: number;
  currency?: string;
  customerId: string;
  orderId: string;
  email: string;
  metadata?: Record<string, any>;
}

interface PaymentInitializeResponse {
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  status: string;
}

interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    status: string;
    amount: number;
    paidAt: string;
    channel: string;
    currency: string;
  };
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  method: string;
  reference: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize payment via backend
export async function initializePayment(
  data: PaymentInitializeRequest
): Promise<PaymentInitializeResponse> {
  const response = await paymentsApi.initiate(data);
  return response.data;
}

// Verify payment status
export async function verifyPayment(
  reference: string
): Promise<PaymentVerificationResponse> {
  const response = await paymentsApi.verify(reference);
  return response.data;
}

// Get payment history
export async function getPayments(customerId?: string): Promise<Payment[]> {
  const params = customerId ? { customerId } : {};
  const response = await paymentsApi.list(params);
  return response.data.payments || response.data;
}

// React Query hooks
export function useInitializePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializePayment,
    onSuccess: () => {
      toast.success("Payment initialized successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initialize payment");
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.status && data.data?.status === "success") {
        toast.success("Payment verified successfully");
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error("Payment verification failed");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify payment");
    },
  });
}

export function usePayments(customerId?: string) {
  return useQuery<Payment[]>({
    queryKey: ["payments", customerId],
    queryFn: () => getPayments(customerId),
    enabled: !!customerId,
  });
}

// Paystack config for React SDK
export function getPaystackConfig(
  publicKey: string,
  email: string,
  amount: number,
  reference: string
) {
  return {
    reference,
    email,
    amount: amount * 100, // Convert to kobo (Paystack uses smallest currency unit)
    publicKey,
    currency: "NGN",
  };
}
