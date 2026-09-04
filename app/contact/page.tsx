import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND } from "@/lib/env";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalLayout title="Contact" updated="September 2026">
      <p>
        {BRAND} is run by Zaheen Zuberi. The fastest way to reach us is email or
        WhatsApp — we usually reply within a day.
      </p>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">Email</h2>
        <p>
          <a className="text-accent" href="mailto:hello@mezmenu.pk">
            hello@mezmenu.pk
          </a>{" "}
          — for sign-up help, billing, menu changes, or anything else.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">WhatsApp</h2>
        <p>
          <a
            className="text-accent"
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
          >
            +92 300 1234567
          </a>{" "}
          — send your paper menu and we&apos;ll get you set up.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">
          Already a customer?
        </h2>
        <p>
          Most changes — prices, new dishes, sold-out items, deals — you make
          yourself from your dashboard, and they go live instantly. Email us if
          you get stuck.
        </p>
      </section>
    </LegalLayout>
  );
}
