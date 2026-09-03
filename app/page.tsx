import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroMenuCard } from "@/components/HeroMenuCard";
import { BRAND, PRICE_STANDARD } from "@/lib/env";

const EXAMPLES = [
  {
    slug: "demo-diner",
    name: "Al-Rehman Tikka House",
    kind: "BBQ house · Lahore",
    accent: "#7c2d12",
  },
  {
    slug: "demo-cafe",
    name: "Khwa Coffee Co.",
    kind: "Café · Islamabad",
    accent: "#3f3d56",
  },
  {
    slug: "demo-burgers",
    name: "Patty Wagon",
    kind: "Smash burgers · Karachi",
    accent: "#b91c1c",
  },
];

const FEATURES = [
  {
    title: "Edit prices in seconds",
    body: "Change a price, mark a dish sold out, add a deal. Live the moment you save — no reprinting, ever.",
  },
  {
    title: "One QR per table",
    body: "Print a sheet of table QR codes once. Diners scan, the menu opens on their phone, fast.",
  },
  {
    title: "Orders on WhatsApp",
    body: "Diners build their order and it lands on the number you already watch. Or keep the menu view-only.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-text-muted hover:text-text">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-accent px-4 py-2 font-medium text-accent-contrast hover:opacity-90"
          >
            Start free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <p className="text-sm font-medium tracking-wide text-accent">
            QR menus for restaurants, cafés &amp; dhabas
          </p>
          <h1 className="mt-4 font-display text-[2.75rem] font-medium leading-[1.05] tracking-[-0.01em] text-text sm:text-6xl">
            Change a price,
            <br />
            <span className="italic text-accent">not</span> the whole menu.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted">
            {BRAND} puts your menu on a QR code you control. Prices move, deals
            come and go, dishes sell out — you update it from your phone and
            diners see it instantly. No printer, no delay.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast hover:opacity-90"
            >
              Build my menu
            </Link>
            <Link
              href="/m/demo-diner"
              className="rounded-full border border-border px-6 py-3 font-medium hover:border-accent hover:text-accent"
            >
              See a live example →
            </Link>
          </div>
          <p className="mt-5 text-sm text-text-muted">
            {PRICE_STANDARD}/month · setup is free · cancel anytime
          </p>
        </div>

        <div className="justify-self-center lg:justify-self-end">
          <HeroMenuCard />
        </div>
      </section>

      {/* Live examples */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-medium">
            Real menus, running on {BRAND}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Open one on your phone — this is exactly what your diners would see.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {EXAMPLES.map((e) => (
              <Link
                key={e.slug}
                href={`/m/${e.slug}`}
                className="group rounded-card border border-border bg-bg p-5 transition-colors hover:border-accent"
              >
                <span
                  className="inline-block h-2 w-10 rounded-full"
                  style={{ background: e.accent }}
                />
                <p className="mt-3 font-medium">{e.name}</p>
                <p className="text-sm text-text-muted">{e.kind}</p>
                <p className="mt-4 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  View menu →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium">
              Get your menu online today
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {PRICE_STANDARD} a month. We help you load the first menu, free.
            </p>
          </div>
          <Link
            href="/signup"
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
