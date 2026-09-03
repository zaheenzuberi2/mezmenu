import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { SetupNotice } from "@/components/SetupNotice";
import type { Restaurant } from "@/lib/types";
import { AdminRow } from "./AdminRow";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  await requireAdmin();

  const db = createAdminClient();

  const [{ data: restaurants }, { data: userList }] = await Promise.all([
    db
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false }),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailById = new Map(
    (userList?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const rows = (restaurants ?? []) as Restaurant[];
  const paidCount = rows.filter((r) => r.is_paid).length;
  const liveCount = rows.filter((r) => r.is_published).length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <span className="text-sm text-text-muted">Admin</span>
      </header>

      <div className="mt-6 flex gap-6 text-sm text-text-muted">
        <span>
          <strong className="text-text">{rows.length}</strong> restaurants
        </span>
        <span>
          <strong className="text-text">{liveCount}</strong> live
        </span>
        <span>
          <strong className="text-text">{paidCount}</strong> paid
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-card border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-3 py-2">Restaurant</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Live</th>
              <th className="px-3 py-2">Paid</th>
              <th className="px-3 py-2">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <AdminRow
                key={r.id}
                restaurant={r}
                ownerEmail={emailById.get(r.owner_id) ?? "—"}
                origin={siteUrl()}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-text-muted">
                  No restaurants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
