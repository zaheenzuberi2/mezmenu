/** Removes throwaway test data created during manual verification. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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

await db.from("restaurants").delete().eq("slug", "bilal-broast-house");

const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
for (const u of list.users) {
  if (u.email === "bilal@test.mezmenu.local") {
    await db.auth.admin.deleteUser(u.id);
    console.log("deleted test user", u.email);
  }
}
console.log("cleanup done");
