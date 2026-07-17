import Spinner from "./Spinner";

// Centered loading indicator for data-fetching states.
export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <Spinner /> <span className="text-sm">{label}</span>
    </div>
  );
}

// Error panel with an optional retry action.
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Empty-list placeholder.
export function EmptyState({ message }: { message: string }) {
  return <div className="py-12 text-center text-sm text-gray-500">{message}</div>;
}
