"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCategoryOptions } from "@/hooks/useCategories";
import type { ProductFormValues } from "@/hooks/useProducts";
import type { Product } from "@/types";

interface ProductFormProps {
  initial?: Product | null;
  submitting?: boolean;
  serverErrors?: Record<string, string>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

export default function ProductForm({
  initial,
  submitting,
  serverErrors,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { data: categories, isLoading: loadingCategories } = useCategoryOptions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: initial?.name ?? "",
      sku: initial?.sku ?? "",
      category_id: initial?.category_id ?? 0,
      price: initial ? Number(initial.price) : 0,
      quantity: initial?.quantity ?? 0,
      description: initial?.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      sku: initial?.sku ?? "",
      category_id: initial?.category_id ?? 0,
      price: initial ? Number(initial.price) : 0,
      quantity: initial?.quantity ?? 0,
      description: initial?.description ?? "",
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          error={errors.name?.message ?? serverErrors?.name}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="SKU"
          error={errors.sku?.message ?? serverErrors?.sku}
          {...register("sku", { required: "SKU is required" })}
        />
      </div>

      <Select
        label="Category"
        error={errors.category_id?.message ?? serverErrors?.category_id}
        {...register("category_id", {
          required: "Category is required",
          valueAsNumber: true,
          validate: (v) => v > 0 || "Category is required",
        })}
      >
        <option value={0}>{loadingCategories ? "Loading..." : "Select a category"}</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          error={errors.price?.message ?? serverErrors?.price}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price must be 0 or more" },
          })}
        />
        <Input
          label="Quantity"
          type="number"
          min="0"
          error={errors.quantity?.message ?? serverErrors?.quantity}
          {...register("quantity", {
            required: "Quantity is required",
            valueAsNumber: true,
            min: { value: 0, message: "Quantity must be 0 or more" },
          })}
        />
      </div>

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
