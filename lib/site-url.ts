/**
 * Client-safe origin. Prefers an explicit NEXT_PUBLIC_SITE_URL, then the
 * browser's own origin, then localhost. Server code should use siteUrl()
 * from lib/env instead.
 */
export function siteUrlClient(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}
