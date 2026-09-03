# MezMenu

QR menus for restaurants. An owner types their menu once, publishes it to
`/m/<slug>`, prints a sheet of table QR codes, and edits prices from their
phone. Diners scan, browse, and send an order straight to the restaurant's
WhatsApp.

Package: **Standard, PKR 3,999/month.** Text menus only (no item photos),
WhatsApp-handoff ordering, deal banner, sold-out toggle, per-table QR codes.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, Tailwind v4
- **Supabase** — Postgres + Auth (email/password) + RLS
- Deploy target: **Netlify** (free tier) behind **Cloudflare** (free)
- Running cost: **$0/month** until a free-tier cap is hit

### Database note

MezMenu currently shares the **couples-site Supabase project**. Its tables
(`restaurants`, `menu_categories`, `menu_items`, `restaurant_tables`) are
namespaced and do not collide. To split it out later: create a dedicated
project, `pg_dump` those four tables + the `owns_restaurant` /
`restaurant_is_public` / `touch_updated_at` functions, and swap the keys in
`.env.local`.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
node scripts/apply-schema.mjs # creates tables + RLS (idempotent)
node scripts/seed-demo.mjs    # optional: a published demo at /m/demo-diner
npm run dev
```

Auth uses **email + password with email confirmation disabled** (Supabase
dashboard → Authentication → Providers → Email → "Confirm email" off).
Password reset is the only flow that sends an email; wire a free SMTP
(Resend) when that matters.

### Environment

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | required |
| `SUPABASE_SERVICE_ROLE_KEY` | `/admin`, signup pre-confirm, scripts |
| `SUPABASE_DB_URL` | Postgres connection string, only for `scripts/apply-schema.mjs` |
| `NEXT_PUBLIC_SITE_URL` | set once there's a custom domain |
| `ADMIN_EMAILS` | comma-separated, for `/admin` (not built yet) |

## Routes

| Path | What |
|---|---|
| `/` | Marketing landing |
| `/m/[slug]` | **Public diner menu** — cart in `localStorage`, WhatsApp order, `?t=` table label |
| `/signup`, `/login`, `/forgot`, `/reset` | Auth |
| `/dashboard` | Menu editor — categories, items, price, sold-out, popular, reorder, publish |
| `/dashboard/settings` | Name, tagline, deal banner, accent colour, WhatsApp number, ordering toggle |
| `/dashboard/qr` | Menu QR + per-table QR, PNG download |
| `/dashboard/qr/sheet` | Print-ready grid of table cards |
| `/admin` | Owner-only (ADMIN_EMAILS) — list restaurants, mark paid, set plan |
| `/privacy`, `/terms` | Legal |

## Scripts

- `scripts/apply-schema.mjs` — apply `supabase-setup.sql` (idempotent)
- `scripts/seed-demo.mjs` — one published demo restaurant
- `scripts/ensure-admin.mjs` — create owner accounts for ADMIN_EMAILS
- `scripts/cleanup-test.mjs` — remove manual-test rows

## Deploy

See `DEPLOY.md` — GitHub → Netlify (config in `netlify.toml`) → Cloudflare.

## Not built yet

- Pro tier (multi-branch, custom subdomain, remove branding, analytics)
- Custom SMTP for password-reset email (Resend)
- Splitting off a dedicated Supabase project
