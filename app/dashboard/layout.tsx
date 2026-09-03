import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser } from "@/lib/auth";
import { getMyRestaurant } from "@/lib/data";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const user = await getUser();
  if (!user) redirect("/login");

  const restaurant = await getMyRestaurant();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-surface print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {restaurant?.is_published && (
              <Link
                href={`/m/${restaurant.slug}`}
                target="_blank"
                className="text-text-muted hover:text-text"
              >
                View live menu ↗
              </Link>
            )}
            <form action="/auth/signout" method="post">
              <button className="text-text-muted hover:text-text">
                Log out
              </button>
            </form>
          </div>
        </div>
        {restaurant && <DashboardNav />}
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
