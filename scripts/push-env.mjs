/**
 * Pushes the required env vars to the linked Vercel project (production +
 * preview). Supabase values are read from the shared couples-site .env.local
 * so no secret is typed on a command line. One-off; safe to re-run.
 *
 *   node scripts/push-env.mjs
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
  }
  return out;
}

const shared = parseEnv(join(root, "..", "couples-site", ".env.local"));

const vars = {
  NEXT_PUBLIC_SUPABASE_URL: shared.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: shared.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: shared.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAILS: "mzaheen3307@gmail.com,zaheenzuberi2@gmail.com",
  NEXT_PUBLIC_BRAND: "MezMenu",
  NEXT_PUBLIC_PRICE_STANDARD: "PKR 4,000",
};

for (const [name, value] of Object.entries(vars)) {
  if (!value) {
    console.log(`SKIP ${name} (no value found)`);
    continue;
  }
  for (const env of ["production", "preview"]) {
    try {
      execFileSync("npx vercel env rm " + name + " " + env + " --yes", {
        cwd: root,
        stdio: "ignore",
        shell: true,
      });
    } catch {
      /* not set yet - fine */
    }
    execFileSync("npx vercel env add " + name + " " + env, {
      cwd: root,
      input: value + "\n",
      stdio: ["pipe", "ignore", "inherit"],
      shell: true,
    });
    console.log(`set ${name} [${env}]`);
  }
}

console.log("done");
