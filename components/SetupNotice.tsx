/**
 * Shown wherever the app needs Supabase but the env vars are missing.
 * Keeps local dev and first deploys from crashing with a blank screen.
 */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <div className="rounded-card border bg-surface p-6 shadow-[var(--shadow)]">
        <h1 className="text-lg font-semibold">Almost there</h1>
        <p className="mt-2 text-sm text-text-muted">
          MezMenu needs a Supabase project to run. Add these to{" "}
          <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
            .env.local
          </code>{" "}
          and restart:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-2 p-3 text-xs leading-5">
          {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...`}
        </pre>
        <p className="mt-4 text-sm text-text-muted">
          Then run <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">supabase-setup.sql</code>{" "}
          in the Supabase SQL editor.
        </p>
      </div>
    </div>
  );
}
