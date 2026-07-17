"use client";

import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type ProductFormValues,
} from "@/hooks/useProducts";
import { useCategoryOptions } from "@/hooks/useCategories";
import type { Product } from "@/types";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateBlocks";
import { getErrorMessage, getFieldErrors } from "@/lib/errors";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { data, isLoading, isError, error, refetch } = useProducts({
    search,
    category_id: categoryId,
    page,
  });
  const { data: categories } = useCategoryOptions();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const openCreate = () => {
    setEditing(null);
    setServerErrors({});
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setServerErrors({});
    setFormOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    setServerErrors({});
    const onError = (err: unknown) => setServerErrors(getFieldErrors(err));
    if (editing) {
      updateProduct.mutate(
        { id: editing.id, values },
        { onSuccess: () => setFormOpen(false), onError }
      );
    } else {
      createProduct.mutate(values, { onSuccess: () => setFormOpen(false), onError });
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteProduct.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory items</p>
        </div>
        <Button onClick={openCreate}>+ New Product</Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or SKU..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:max-w-xs"
          />
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value ? Number(e.target.value) : "");
              setPage(1);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-56"
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
        {data && data.data.length === 0 && <EmptyState message="No products found." />}
        {data && data.data.length > 0 && (
          <>
            <ProductTable products={data.data} onEdit={openEdit} onDelete={setDeleting} />
            <Pagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <Modal
        open={formOpen}
        title={editing ? "Edit Product" : "New Product"}
        onClose={() => setFormOpen(false)}
      >
        <ProductForm
          initial={editing}
          submitting={createProduct.isPending || updateProduct.isPending}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!deleting}
        message={`Delete product "${deleting?.name}"? This action cannot be undone.`}
        loading={deleteProduct.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
