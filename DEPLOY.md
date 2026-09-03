# Deploying MezMenu

Free stack: **GitHub → Netlify → Cloudflare**. Running cost stays $0 until a
free-tier cap is hit.

---

## 1. Push to GitHub

From `mezmenu/`:

```bash
git add -A
git commit -m "MezMenu: menu editor, diner page, auth, QR, admin"
gh repo create mezmenu --private --source=. --push
```

(or create an empty repo on github.com and `git remote add origin … && git push -u origin main`)

`.env.local` is git-ignored - no secrets go to GitHub.

---

## 2. Connect Netlify

1. app.netlify.com → **Add new site → Import from Git** → pick `mezmenu`.
2. Build settings are read from `netlify.toml` - leave them as detected.
3. **Site settings → Environment variables**, add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page (`anon` / publishable) |
   | `SUPABASE_SERVICE_ROLE_KEY` | same page (`service_role`) - **not** public |
   | `ADMIN_EMAILS` | `mzaheen3307@gmail.com,zaheenzuberi2@gmail.com` |
   | `NEXT_PUBLIC_BRAND` | `MezMenu` |
   | `NEXT_PUBLIC_PRICE_STANDARD` | `PKR 4,000` |

   Do **not** set `SUPABASE_DB_URL` - it is only for the local schema script.
   `NEXT_PUBLIC_SITE_URL` is optional; leave it unset and the app uses the
   Netlify URL automatically.
4. **Deploy**. First build takes ~2-3 min. Every push to `main` redeploys.

Your menu is then live at `https://<site-name>.netlify.app` and
`/m/<slug>` works immediately.

---

## 3. Cloudflare (later, optional)

Only needed once traffic grows or you add a custom domain.

1. Add the site to Cloudflare, point the domain's nameservers at Cloudflare.
2. In Netlify, add the custom domain; set `NEXT_PUBLIC_SITE_URL` to it.
3. Cloudflare caching rule: cache `"/_next/static/*"` and QR image
   responses aggressively; bypass cache for `"/dashboard/*"` and
   `"/api/*"`.

---

## Supabase one-time settings

- **Authentication → Providers → Email → "Confirm email" OFF** (signup is
  instant, no email sent).
- Run `supabase-setup.sql` once in the SQL editor (or `node
  scripts/apply-schema.mjs` locally with `SUPABASE_DB_URL` set).
- Password-reset emails use Supabase's built-in sender (rate-limited). Add a
  free Resend SMTP under **Authentication → Emails** when resets become
  common.
