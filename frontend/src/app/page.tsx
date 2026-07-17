import { redirect } from "next/navigation";

// The root path simply forwards to the dashboard (which enforces auth).
export default function Home() {
  redirect("/dashboard");
}
