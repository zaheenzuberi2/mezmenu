/**
 * A restaurant's menu lives at /m/<slug>, so slugs only share a namespace
 * with each other - but keep the app's own words reserved anyway in case
 * routes move to the root later.
 */
const RESERVED = new Set([
  "m",
  "api",
  "auth",
  "dashboard",
  "login",
  "logout",
  "signup",
  "admin",
  "settings",
  "account",
  "billing",
  "new",
  "edit",
  "order",
  "menu",
  "qr",
  "r",
  "t",
  "table",
  "pricing",
  "about",
  "contact",
  "help",
  "support",
  "terms",
  "privacy",
  "static",
  "public",
  "assets",
  "images",
  "favicon",
  "robots",
  "sitemap",
  "well-known",
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export type SlugCheck = { ok: true } | { ok: false; reason: string };

export function validateSlug(slug: string): SlugCheck {
  if (!slug) return { ok: false, reason: "Pick a web address for your menu." };
  if (slug.length < 3)
    return { ok: false, reason: "Too short - use at least 3 characters." };
  if (slug.length > 50)
    return { ok: false, reason: "Too long - keep it under 50 characters." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return {
      ok: false,
      reason: "Use lowercase letters, numbers and hyphens only.",
    };
  if (RESERVED.has(slug))
    return { ok: false, reason: `"${slug}" is reserved. Try another.` };
  return { ok: true };
}

export function isReserved(slug: string): boolean {
  return RESERVED.has(slug);
}
