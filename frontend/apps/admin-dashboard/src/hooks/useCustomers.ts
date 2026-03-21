"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  lga?: string;
  tier: string;
  status: string;
  creditLimit: number;
  outstandingBalance?: number;
  availableCredit?: number;
  creditUtilization?: number;
  totalOrders?: number;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersResponse {
  data: Customer[];
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

// Get customers with pagination and filters
export function useCustomers(params?: {
  page?: number;
  limit?: number;
  tier?: string;
  status?: string;
  search?: string;
}) {
  return useQuery<CustomersResponse>({
    queryKey: ["customers", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.tier) queryParams.append("tier", params.tier);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
    staleTime: 60 * 1000,
  });
}

// Get single customer
export function useCustomer(id: string) {
  return useQuery<{ data: Customer }>({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch customer");
      return response.json();
    },
    enabled: !!id,
  });
}

// Get customer credit status
export function useCustomerCreditStatus(id: string) {
  return useQuery<{
    data: {
      customerId: string;
      customerName: string;
      creditLimit: number;
      outstandingBalance: number;
      availableCredit: number;
      creditUtilization: number;
      tier: string;
    };
  }>({
    queryKey: ["customer-credit", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers/${id}/credit-status`
      );
      if (!response.ok) throw new Error("Failed to fetch credit status");
      return response.json();
    },
    enabled: !!id,
  });
}

// Create customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Customer>) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to create customer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

// Update customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to update customer");
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
    },
  });
}

// Delete customer (soft delete)
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/customers/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete customer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
