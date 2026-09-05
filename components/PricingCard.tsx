import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { PRICE_STANDARD } from "@/lib/env";

const FEATURES = [
  "We build your first menu with you, at no cost",
  "No commission on any order",
  "Change your menu and prices as often as you like",
  "Mark anything sold out in one tap",
  "Orders come to WhatsApp with the table number",
  "One QR code, plus a printable sheet for your tables",
];

export function PricingCard() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-semibold text-accent">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            One plan, with nothing hidden
          </h2>
        </div>

        <div className="relative mx-auto mt-14 max-w-md">
          <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-contrast shadow-lg shadow-accent/30">
            First menu built for you, free
          </span>

          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-bg shadow-[var(--shadow)]">
            <div className="glow-ink overflow-hidden bg-ink px-8 pt-9 pb-7 text-on-ink">
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium tracking-wide text-gold-soft ring-1 ring-inset ring-gold/25">
                Standard
              </span>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-5xl font-medium text-gold-soft">
                  {PRICE_STANDARD}
                </span>
                <span className="pb-1.5 text-on-ink-muted">/ month</span>
              </div>
              <p className="mt-2 text-sm text-on-ink-muted">
                You don&apos;t need a card to build your menu.
              </p>
            </div>

            <div className="p-8">
              <ul className="space-y-3.5">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-7 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 hover:opacity-95"
              >
                Build my menu free
              </Link>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-ok/10 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-ok">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <p className="text-xs leading-relaxed text-text">
                  <strong className="font-semibold">
                    We&apos;ll load your first menu for you, at no cost.
                  </strong>{" "}
                  Send your paper menu on WhatsApp and you won&apos;t have to
                  type any of it out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
