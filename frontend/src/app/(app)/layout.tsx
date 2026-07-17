import AppShell from "@/components/layout/AppShell";

// Layout for all authenticated pages inside the (app) route group.
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
