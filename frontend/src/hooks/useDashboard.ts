"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

// Loads the dashboard summary (cards + low-stock list).
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>("/dashboard");
      return data;
    },
  });
}
