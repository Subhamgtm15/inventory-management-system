"use client";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, total, onPageChange }: PaginationProps) {
  if (lastPage <= 1) {
    return (
      <div className="px-5 py-3 text-xs text-gray-500">{total} result{total === 1 ? "" : "s"}</div>
    );
  }

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <p className="text-xs text-gray-500">
        Page {currentPage} of {lastPage} &middot; {total} results
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
