import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";

/**
 * Next 16 renamed `middleware.ts` to `proxy.ts`. Same behaviour, new name -
 * the Supabase docs still show the old filename.
 *
 * Its only job here is to refresh the Supabase auth cookie so Server
 * Components see a valid session. Access control lives in the pages
 * themselves and in Postgres RLS, not here.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touching getUser() is what triggers the refresh. Do not remove.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Only routes that actually read the session need this. The old regex
  // matched everything except static assets - so the landing page, every
  // diner menu, /contact etc. were all paying a real network round-trip to
  // Supabase on every single request (visible as ~500ms of extra TTFB even
  // on a cached static page, since middleware runs before the cache is
  // served). None of those pages use a session, so they're excluded here.
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot",
    "/reset",
    "/auth/:path*",
  ],
};
