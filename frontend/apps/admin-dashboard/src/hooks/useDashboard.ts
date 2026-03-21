"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Dashboard Stats Hook
export function useDashboardStats(period?: string) {
  return useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: async () => {
      const response = await api.getDashboardStats();
      return response;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Executive Dashboard Data from Reporting Service
export function useExecutiveDashboard(period: string = "month") {
  return useQuery({
    queryKey: ["executive-dashboard", period],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/reports/dashboard/executive?period=${period}`
      );
      if (!response.ok) throw new Error("Failed to fetch executive dashboard");
      const data = await response.json();
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Real-time Metrics
export function useRealtimeMetrics() {
  return useQuery({
    queryKey: ["realtime-metrics"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/reports/metrics/realtime`
      );
      if (!response.ok) throw new Error("Failed to fetch realtime metrics");
      const data = await response.json();
      return data.data;
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 30 * 1000,
  });
}
