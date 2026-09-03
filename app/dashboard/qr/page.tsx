import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { requireRestaurant, getMyTables } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { QrManager } from "./QrManager";

export const metadata: Metadata = { title: "QR codes" };

export default async function QrPage() {
  await requireUser();
  const restaurant = await requireRestaurant();
  const tables = await getMyTables();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">QR codes</h1>
          <p className="text-sm text-text-muted">
            One code for the menu, plus one per table so orders show the table
            number.
          </p>
        </div>
        {restaurant.is_published ? (
          <Link
            href="/dashboard/qr/sheet"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90"
          >
            Open print sheet
          </Link>
        ) : (
          <span className="text-sm text-text-muted">
            Publish your menu to print QR codes.
          </span>
        )}
      </div>

      <QrManager
        slug={restaurant.slug}
        origin={siteUrl()}
        tables={tables}
      />
    </div>
  );
}
