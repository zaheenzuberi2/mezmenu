"use client";

import { useState, useTransition } from "react";
import { Qr, useQrDataUrl } from "@/components/Qr";
import type { RestaurantTable } from "@/lib/types";
import { addTable, deleteTable } from "../actions";

function menuUrl(origin: string, slug: string, table?: string) {
  const u = new URL(`${origin}/m/${slug}`);
  if (table) u.searchParams.set("t", table);
  return u.toString();
}

export function QrManager({
  slug,
  origin,
  tables,
}: {
  slug: string;
  origin: string;
  tables: RestaurantTable[];
}) {
  const [, start] = useTransition();
  const [label, setLabel] = useState("");
  const run = (fn: () => Promise<unknown>) => start(() => void fn());

  const baseUrl = menuUrl(origin, slug);
  const baseDownload = useQrDataUrl(baseUrl);

  return (
    <div className="space-y-6">
      {/* Menu QR */}
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold">Menu QR</h2>
        <p className="mt-1 text-sm text-text-muted">
          For the counter, the door, or your Instagram bio. No table number.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Qr value={baseUrl} size={150} />
          <div className="text-sm">
            <p className="break-all text-text-muted">
              {baseUrl.replace(/^https?:\/\//, "")}
            </p>
            {baseDownload && (
              <a
                href={baseDownload}
                download={`${slug}-menu-qr.png`}
                className="mt-2 inline-block rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
              >
                Download PNG
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold">Tables</h2>
        <p className="mt-1 text-sm text-text-muted">
          Add each table once. Its QR opens the menu with that table number
          attached.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && label.trim()) {
                run(() => addTable(label));
                setLabel("");
              }
            }}
            placeholder="Table label, e.g. 5 or Terrace 2"
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={() => {
              if (label.trim()) {
                run(() => addTable(label));
                setLabel("");
              }
            }}
            className="shrink-0 whitespace-nowrap rounded-full bg-accent px-4 text-sm font-medium text-accent-contrast hover:opacity-90"
          >
            Add table
          </button>
        </div>

        {tables.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tables.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Qr value={menuUrl(origin, slug, t.label)} size={72} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Table {t.label}</p>
                  <button
                    onClick={() => run(() => deleteTable(t.id))}
                    className="text-xs text-text-muted hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
