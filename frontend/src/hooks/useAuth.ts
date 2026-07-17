"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth";
import type { User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Fetches the currently authenticated user (used to guard pages).
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<User>("/me");
      return data;
    },
    enabled: typeof window !== "undefined" && !!getToken(),
    retry: false,
  });
}

// Handles login: stores the token and redirects to the dashboard.
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>("/login", payload);
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(["me"], data.user);
      router.replace("/dashboard");
    },
  });
}

// Handles logout: revokes the token server-side, then clears client state.
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },
    onSettled: () => {
      clearToken();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
