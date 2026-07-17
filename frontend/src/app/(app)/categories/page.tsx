"use client";

import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type CategoryFormValues,
} from "@/hooks/useCategories";
import type { Category } from "@/types";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryForm from "@/components/categories/CategoryForm";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateBlocks";
import { getErrorMessage, getFieldErrors } from "@/lib/errors";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { data, isLoading, isError, error, refetch } = useCategories({ search, page });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const openCreate = () => {
    setEditing(null);
    setServerErrors({});
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setServerErrors({});
    setFormOpen(true);
  };

  const handleSubmit = (values: CategoryFormValues) => {
    setServerErrors({});
    const onError = (err: unknown) => setServerErrors(getFieldErrors(err));
    if (editing) {
      updateCategory.mutate(
        { id: editing.id, values },
        { onSuccess: () => setFormOpen(false), onError }
      );
    } else {
      createCategory.mutate(values, { onSuccess: () => setFormOpen(false), onError });
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteCategory.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Manage product categories</p>
        </div>
        <Button onClick={openCreate}>+ New Category</Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories..."
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-72"
          />
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
        {data && data.data.length === 0 && <EmptyState message="No categories found." />}
        {data && data.data.length > 0 && (
          <>
            <CategoryTable categories={data.data} onEdit={openEdit} onDelete={setDeleting} />
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
        title={editing ? "Edit Category" : "New Category"}
        onClose={() => setFormOpen(false)}
      >
        <CategoryForm
          initial={editing}
          submitting={createCategory.isPending || updateCategory.isPending}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!deleting}
        message={`Delete category "${deleting?.name}"? This will also delete its products.`}
        loading={deleteCategory.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
