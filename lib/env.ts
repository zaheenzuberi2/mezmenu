/**
 * Central configuration.
 *
 * Forgiving by design: anything that can be derived at runtime is derived,
 * so a missing env var never takes the site down. Only the two Supabase
 * keys are genuinely required to talk to the database.
 */

/** Supabase project URL. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Public client key. Supabase renamed "anon key" to "publishable key" and
 * dashboards show either depending on project age, so accept both names.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/** Server-only. Bypasses RLS - never expose to the browser. */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the app has enough config to reach Supabase at all. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Absolute origin of this deployment. Used for magic-link redirects and for
 * showing an owner their shareable menu URL and QR codes.
 *
 * Resolved in this order so it works with zero configuration:
 *   1. NEXT_PUBLIC_SITE_URL          - set once there is a custom domain
 *   2. URL / DEPLOY_PRIME_URL        - Netlify build + deploy-preview hosts
 *   3. VERCEL_PROJECT_PRODUCTION_URL - stable production host on Vercel
 *   4. VERCEL_URL                    - per-deployment host (previews)
 *   5. localhost                     - local dev
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const netlify = process.env.URL ?? process.env.DEPLOY_PRIME_URL;
  if (netlify) return netlify.replace(/\/$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Emails allowed into /admin (comma-separated in ADMIN_EMAILS).
 * Case-insensitive, whitespace-tolerant. No admin configured = no admin
 * access, rather than everyone being admin.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

/** Product name, so a rebrand is a one-line change. */
export const BRAND = process.env.NEXT_PUBLIC_BRAND ?? "MezMenu";

/**
 * MezMenu's own contact number (digits, international, no "+"), shown on the
 * Contact page and as a subtle link on every diner menu. Empty = hidden.
 */
export const CONTACT_PHONE = (
  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? ""
).replace(/[^0-9]/g, "");

/** Pretty version for display, e.g. "+92 300 1234567". */
export const CONTACT_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ??
  (CONTACT_PHONE ? `+${CONTACT_PHONE}` : "");

/** Standard package price, display only. */
export const PRICE_STANDARD =
  process.env.NEXT_PUBLIC_PRICE_STANDARD ?? "PKR 3,999";
