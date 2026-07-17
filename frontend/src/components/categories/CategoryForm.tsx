"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Category } from "@/types";
import type { CategoryFormValues } from "@/hooks/useCategories";

interface CategoryFormProps {
  initial?: Category | null;
  submitting?: boolean;
  serverErrors?: Record<string, string>;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  initial,
  submitting,
  serverErrors,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: initial?.name ?? "", description: initial?.description ?? "" },
  });

  useEffect(() => {
    reset({ name: initial?.name ?? "", description: initial?.description ?? "" });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        error={errors.name?.message ?? serverErrors?.name}
        {...register("name", { required: "Name is required" })}
      />
      <Textarea
        label="Description"
        error={errors.description?.message ?? serverErrors?.description}
        {...register("description")}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
