import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND, PRICE_STANDARD } from "@/lib/env";

const FEATURES = [
  {
    title: "Edit prices in seconds",
    body: "Change a price, mark a dish sold out, add a deal. It is live the moment you save - no reprinting, ever.",
  },
  {
    title: "One QR per table",
    body: "Print a sheet of table QR codes once. Diners scan, the menu opens on their phone, fast.",
  },
  {
    title: "Orders on WhatsApp",
    body: "Diners build their order and it lands as a message on the number you already watch. Or keep the menu view-only.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
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

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-24">
        <p className="text-sm font-medium text-accent">
          For restaurants, cafés and dhabas
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Change a price, not the whole menu.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-text-muted">
          {BRAND} puts your menu on a QR code you control. Prices move, deals
          come and go, dishes sell out - you update it from your phone and
          diners see it instantly. No printer, no delay.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast hover:opacity-90"
          >
            Build my menu
          </Link>
          <span className="text-sm text-text-muted">
            {PRICE_STANDARD}/month · setup is free
          </span>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
