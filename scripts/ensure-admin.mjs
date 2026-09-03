/**
 * Ensures an owner account exists for each ADMIN_EMAILS address so /admin can
 * be reached. Prints a temporary password for any account it creates -
 * change it from /forgot after first login.
 *
 *   node scripts/ensure-admin.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const emails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });

for (const email of emails) {
  const existing = list.users.find((u) => u.email === email);
  if (existing) {
    console.log(`exists: ${email}`);
    continue;
  }
  const password = randomBytes(9).toString("base64url");
  const { error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.log(`FAILED ${email}: ${error.message}`);
  } else {
    console.log(`created: ${email}   temp password: ${password}`);
  }
}
