import { AxiosError } from "axios";
import type { ValidationErrorResponse } from "@/types";

// Extracts a human-readable message from an Axios error.
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ValidationErrorResponse> | undefined;
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}

// Extracts Laravel 422 field errors as a flat { field: message } map.
export function getFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (error instanceof AxiosError && error.response?.status === 422) {
    const data = error.response.data as ValidationErrorResponse;
    for (const [field, messages] of Object.entries(data.errors ?? {})) {
      if (messages?.length) result[field] = messages[0];
    }
  }
  return result;
}
