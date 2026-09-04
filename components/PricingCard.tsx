import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { PRICE_STANDARD } from "@/lib/env";

const FEATURES = [
  "Free setup — we're not charging you to get online",
  "Zero commission on every order",
  "Unlimited menu and price updates",
  "Sold-out toggle, live in one tap",
  "Direct WhatsApp ordering, table number included",
  "One QR code + a printable table sheet",
];

export function PricingCard() {
  return (
    <section id="pricing" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Pricing
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            One plan. Nothing hidden.
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-[1.5rem] border border-border bg-bg shadow-[var(--shadow)]">
          <div className="bg-ink px-8 pt-8 pb-7 text-on-ink">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Standard
            </span>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-5xl font-medium">
                {PRICE_STANDARD}
              </span>
              <span className="pb-1.5 text-on-ink-muted">/ month</span>
            </div>
            <p className="mt-2 text-sm text-on-ink-muted">
              No card required to build your menu.
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
              className="mt-7 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast hover:opacity-90"
            >
              Build my menu free
            </Link>
            <p className="mt-3 text-center text-xs text-text-muted">
              We help you load your first menu at no cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
