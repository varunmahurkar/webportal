/**
 * Protected Layout — server-side auth gate for /profile and other protected routes.
 * Calls: lib/supabase/server.ts (check session). Redirects to / if unauthenticated.
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
