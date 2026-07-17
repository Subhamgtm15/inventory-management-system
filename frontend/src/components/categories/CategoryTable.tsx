"use client";

import type { Category } from "@/types";
import Button from "@/components/ui/Button";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Description</th>
            <th className="px-5 py-3 text-center">Products</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium text-gray-900">{category.name}</td>
              <td className="max-w-md truncate px-5 py-3 text-gray-500">
                {category.description || "-"}
              </td>
              <td className="px-5 py-3 text-center text-gray-600">
                {category.products_count ?? 0}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => onEdit(category)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(category)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
