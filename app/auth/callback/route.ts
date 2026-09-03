import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for the password-reset email link. Supabase sends the user
 * here with a `code`, which we swap for a session before forwarding them to
 * the page where they set a new password.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const requested = searchParams.get("next") ?? "/reset";
  const next =
    requested.startsWith("/") && !requested.startsWith("//")
      ? requested
      : "/reset";

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=expired`);

  return NextResponse.redirect(`${origin}${next}`);
}
