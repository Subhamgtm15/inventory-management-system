"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, Product, ResourceResponse } from "@/types";

export interface ProductFormValues {
  name: string;
  sku: string;
  category_id: number;
  price: number;
  quantity: number;
  description?: string | null;
}

export interface ProductListParams {
  search?: string;
  category_id?: number | "";
  page?: number;
}

// List products with search, category filter, and pagination.
export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Product>>("/products", {
        params: {
          search: params.search || undefined,
          category_id: params.category_id || undefined,
          page: params.page || 1,
        },
      });
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { data } = await api.post<ResourceResponse<Product>>("/products", values);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: ProductFormValues }) => {
      const { data } = await api.put<ResourceResponse<Product>>(`/products/${id}`, values);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
