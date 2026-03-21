"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Inspection {
  id: string;
  inspectionNumber: string;
  batchId?: string;
  batch?: {
    batchNumber: string;
  };
  productId: string;
  product?: {
    name: string;
    sku: string;
  };
  type: string;
  result: string;
  inspectorId: string;
  inspector?: {
    name: string;
  };
  inspectionDate: string;
  notes?: string;
  parameters?: {
    name: string;
    value: number;
    unit: string;
    minSpec?: number;
    maxSpec?: number;
    passed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface NCR {
  id: string;
  ncrNumber: string;
  batchId?: string;
  batch?: {
    batchNumber: string;
  };
  productId?: string;
  product?: {
    name: string;
    sku: string;
  };
  description: string;
  severity: string;
  status: string;
  reportedById: string;
  reportedBy?: {
    name: string;
  };
  assignedToId?: string;
  assignedTo?: {
    name: string;
  };
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface CAPA {
  id: string;
  capaNumber: string;
  ncrId?: string;
  ncr?: NCR;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  assignedToId?: string;
  assignedTo?: {
    name: string;
  };
  dueDate?: string;
  completedAt?: string;
  effectivenessReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionsResponse {
  data: Inspection[];
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

export interface NCRsResponse {
  data: NCR[];
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

export interface CAPAResponse {
  data: CAPA[];
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

// Get inspections
export function useInspections(params?: {
  page?: number;
  limit?: number;
  result?: string;
  type?: string;
  date?: string;
}) {
  return useQuery<InspectionsResponse>({
    queryKey: ["inspections", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.result) queryParams.append("result", params.result);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.date) queryParams.append("date", params.date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/inspections?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch inspections");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get NCRs
export function useNCRs(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
}) {
  return useQuery<NCRsResponse>({
    queryKey: ["ncrs", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.severity) queryParams.append("severity", params.severity);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/ncrs?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch NCRs");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get CAPAs
export function useCAPAs(params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}) {
  return useQuery<CAPAResponse>({
    queryKey: ["capas", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.priority) queryParams.append("priority", params.priority);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/capas?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch CAPAs");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Get quality dashboard stats
export function useQualityStats() {
  return useQuery<{
    data: {
      inspectionsToday: number;
      passed: number;
      failed: number;
      ncrOpen: number;
      capaPending: number;
      complianceRate: number;
    };
  }>({
    queryKey: ["quality-stats"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch quality stats");
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}

// Create inspection
export function useCreateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      batchId?: string;
      productId: string;
      type: string;
      result: string;
      notes?: string;
      parameters?: {
        name: string;
        value: number;
        unit: string;
        minSpec?: number;
        maxSpec?: number;
        passed: boolean;
      }[];
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/inspections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to create inspection");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["quality-stats"] });
    },
  });
}

// Create NCR
export function useCreateNCR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      batchId?: string;
      productId?: string;
      description: string;
      severity: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/ncrs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to create NCR");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ncrs"] });
      queryClient.invalidateQueries({ queryKey: ["quality-stats"] });
    },
  });
}

// Update NCR status
export function useUpdateNCRStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rootCause,
      correctiveAction,
      preventiveAction,
    }: {
      id: string;
      status: string;
      rootCause?: string;
      correctiveAction?: string;
      preventiveAction?: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/quality/ncrs/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            rootCause,
            correctiveAction,
            preventiveAction,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update NCR");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ncrs"] });
      queryClient.invalidateQueries({ queryKey: ["quality-stats"] });
    },
  });
}
