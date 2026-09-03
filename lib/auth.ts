import "server-only";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";

/** The signed-in user, or null. */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Use in a Server Component / action that requires a session. */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Gate for /admin. 404s (rather than redirecting) for a signed-in non-admin
 * so the route's existence is not advertised.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) notFound();
  return user;
}
