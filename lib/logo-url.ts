import { SUPABASE_URL } from "@/lib/env";

/**
 * Public URL for a restaurant logo. `logo_url` stores either a storage path
 * (`<restaurant_id>/logo.png`) or, for older rows, a full URL.
 *
 * Lives in its own module (not lib/data.ts) so Client Components can import
 * it without pulling in "server-only".
 */
export function logoUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/restaurant-logos/${value}`;
}
