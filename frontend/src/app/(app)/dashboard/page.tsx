"use client";

import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import { ErrorState, LoadingState } from "@/components/ui/StateBlocks";
import { getErrorMessage } from "@/lib/errors";

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your inventory</p>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total Products"
              value={data.total_products}
              accent="indigo"
              icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
            <StatCard
              label="Total Categories"
              value={data.total_categories}
              accent="emerald"
              icon="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
            />
            <StatCard
              label={`Low Stock (\u2264 ${data.low_stock_threshold})`}
              value={data.low_stock_count}
              accent="amber"
              icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-3">
              <h2 className="font-semibold text-gray-900">Low Stock Products</h2>
            </div>
            {data.low_stock_products.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">
                No low-stock products. You&apos;re well stocked!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">SKU</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.low_stock_products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-5 py-3 text-gray-500">{p.sku}</td>
                        <td className="px-5 py-3 text-gray-500">{p.category?.name ?? "-"}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {p.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
