"use client";

import { useMe, useLogout } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name ?? "\u00A0"}</p>
          <p className="text-xs text-gray-500">{user?.email ?? "\u00A0"}</p>
        </div>
        <Button variant="secondary" onClick={() => logout.mutate()} loading={logout.isPending}>
          Logout
        </Button>
      </div>
    </header>
  );
}
