"use client";

import type { Product } from "@/types";
import Button from "@/components/ui/Button";

interface ProductTableProps {
  products: Product[];
  lowStockThreshold?: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  lowStockThreshold = 10,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">SKU</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3 text-right">Price</th>
            <th className="px-5 py-3 text-right">Qty</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const low = product.quantity <= lowStockThreshold;
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{product.name}</td>
                <td className="px-5 py-3 text-gray-500">{product.sku}</td>
                <td className="px-5 py-3 text-gray-500">{product.category?.name ?? "-"}</td>
                <td className="px-5 py-3 text-right text-gray-700">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      low ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {product.quantity}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => onEdit(product)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(product)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
