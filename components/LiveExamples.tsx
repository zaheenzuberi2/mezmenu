"use client";

import Link from "next/link";
import { Qr } from "@/components/Qr";
import { siteUrlClient } from "@/lib/site-url";

const EXAMPLES = [
  {
    slug: "demo-diner",
    name: "Al-Rehman Tikka House",
    kind: "BBQ house · Lahore",
    gradient: "linear-gradient(135deg, #3a1408 0%, #7c2d12 55%, #c9622a 100%)",
  },
  {
    slug: "demo-cafe",
    name: "Khwa Coffee Co.",
    kind: "Café · Islamabad",
    gradient: "linear-gradient(135deg, #17151f 0%, #3f3d56 55%, #6b6690 100%)",
  },
  {
    slug: "demo-burgers",
    name: "Patty Wagon",
    kind: "Smash burgers · Karachi",
    gradient: "linear-gradient(135deg, #3a0a0a 0%, #b91c1c 55%, #e2543c 100%)",
  },
];

export function LiveExamples() {
  const origin = siteUrlClient();

  return (
    <section className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              See it live
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium">
              Real menus, running on MezMenu today
            </h2>
          </div>
          <p className="text-sm text-text-muted">
            Scan a code with your phone, or tap the card.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {EXAMPLES.map((e) => (
            <Link
              key={e.slug}
              href={`/m/${e.slug}`}
              className="group block overflow-hidden rounded-card border border-border bg-surface shadow-[var(--shadow)] transition-transform hover:-translate-y-1"
            >
              <div
                className="relative flex h-40 flex-col justify-between p-5"
                style={{ background: e.gradient }}
              >
                <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
                  {e.kind}
                </span>
                <span className="font-display text-2xl font-medium text-white drop-shadow-sm">
                  {e.name}
                </span>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="shrink-0 rounded-xl border border-border bg-white p-1.5 shadow-sm">
                  <Qr value={`${origin}/m/${e.slug}`} size={64} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Scan to view the menu</p>
                  <p className="mt-0.5 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Or tap to open →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
