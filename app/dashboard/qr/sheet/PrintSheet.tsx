"use client";

import { Qr } from "@/components/Qr";
import { logoUrl } from "@/lib/logo-url";

function menuUrl(origin: string, slug: string, table?: string) {
  const u = new URL(`${origin}/m/${slug}`);
  if (table) u.searchParams.set("t", table);
  return u.toString();
}

export function PrintSheet({
  name,
  slug,
  logoPath,
  origin,
  tables,
}: {
  name: string;
  slug: string;
  logoPath: string | null;
  origin: string;
  tables: string[];
}) {
  const logo = logoUrl(logoPath);
  const cards = tables.length > 0 ? tables : [null];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-sm text-text-muted">
          {tables.length > 0
            ? `${tables.length} table ${tables.length === 1 ? "card" : "cards"}`
            : "No tables added - showing the plain menu card. Add tables on the QR page."}
        </p>
        <button
          onClick={() => window.print()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-contrast hover:opacity-90"
        >
          Print
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 print:gap-0">
        {cards.map((label, i) => (
          <div
            key={label ?? i}
            className="flex break-inside-avoid flex-col items-center rounded-xl border border-border p-6 text-center print:m-2 print:rounded-none print:border-black"
          >
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="mb-2 h-12 w-12 object-contain"
              />
            )}
            <p className="text-lg font-semibold text-black">{name}</p>
            <p className="mt-1 text-sm text-neutral-600">
              Scan to see the menu &amp; order
            </p>
            <div className="my-4">
              <Qr value={menuUrl(origin, slug, label ?? undefined)} size={200} />
            </div>
            {label ? (
              <p className="text-base font-medium text-black">Table {label}</p>
            ) : (
              <p className="text-sm text-neutral-600">
                {`${origin.replace(/^https?:\/\//, "")}/m/${slug}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
