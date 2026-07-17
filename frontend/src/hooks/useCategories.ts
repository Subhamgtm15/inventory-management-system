"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category, PaginatedResponse, ResourceResponse } from "@/types";

export interface CategoryFormValues {
  name: string;
  description?: string | null;
}

// List categories with optional search + pagination.
export function useCategories(params: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Category>>("/categories", {
        params: { search: params.search || undefined, page: params.page || 1 },
      });
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data } = await api.post<ResourceResponse<Category>>("/categories", values);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: CategoryFormValues }) => {
      const { data } = await api.put<ResourceResponse<Category>>(`/categories/${id}`, values);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Lightweight helper to load all categories for dropdowns (first page, large size).
export function useCategoryOptions() {
  return useQuery({
    queryKey: ["category-options"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Category>>("/categories", {
        params: { per_page: 100 },
      });
      return data.data;
    },
  });
}
