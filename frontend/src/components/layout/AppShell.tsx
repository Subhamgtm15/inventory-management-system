"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getToken } from "@/lib/auth";
import { useMe } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/StateBlocks";

// Wraps all authenticated pages: guards access + renders the sidebar/navbar chrome.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isError } = useMe();

  // Redirect to /login if there is no token on mount.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // If /me fails (expired token), the Axios interceptor already redirects.
  useEffect(() => {
    if (isError) router.replace("/login");
  }, [isError, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
