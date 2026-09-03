"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, validateSlug } from "@/lib/slug";

export type SignupState = { error?: string };

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8)
    return { error: "Use a password of at least 8 characters." };
  if (!name) return { error: "Enter your restaurant name." };

  const check = validateSlug(slug);
  if (!check.ok) return { error: check.reason };

  const admin = createAdminClient();
  const supabase = await createClient();

  // Slug must be free before we create anything.
  const { data: taken } = await admin
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (taken) return { error: `The address "${slug}" is taken. Try another.` };

  // Create the account pre-confirmed (email confirmation is off by design).
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created?.user?.id;

  if (createErr) {
    // Account already exists - let them finish a half-done signup if the
    // password matches, otherwise send them to log in.
    const { data: signIn, error: signInErr } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInErr || !signIn.user) {
      return {
        error:
          "That email is already registered. Log in instead, or use a different email.",
      };
    }
    userId = signIn.user.id;
  } else {
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInErr) return { error: signInErr.message };
  }

  if (!userId) return { error: "Something went wrong. Try again." };

  // Does this user already have a restaurant? (retry-safe)
  const { data: existing } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (!existing) {
    const { error: insertErr } = await supabase
      .from("restaurants")
      .insert({ owner_id: userId, slug, name });
    if (insertErr) {
      if (insertErr.code === "23505")
        return { error: `The address "${slug}" is taken. Try another.` };
      return { error: insertErr.message };
    }
  }

  redirect("/dashboard");
}
