import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { requireRestaurant, getMyTables } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { PrintSheet } from "./PrintSheet";

export const metadata: Metadata = { title: "QR print sheet" };

export default async function SheetPage() {
  await requireUser();
  const restaurant = await requireRestaurant();
  const tables = await getMyTables();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/dashboard/qr" className="text-sm text-text-muted hover:text-text">
          ← Back
        </Link>
      </div>
      <PrintSheet
        name={restaurant.name}
        slug={restaurant.slug}
        origin={siteUrl()}
        tables={tables.map((t) => t.label)}
      />
    </div>
  );
}
