import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/env";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalLayout title="Contact" updated="September 2026">
      <p>
        {BRAND} is run by Zaheen Zuberi. The fastest way to reach us is by email
        or WhatsApp, and we usually reply within a day.
      </p>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">Email</h2>
        <p>
          <a className="text-accent" href="mailto:hello@mezmenu.pk">
            hello@mezmenu.pk
          </a>{" "}
          is the address for sign-up help, billing, menu changes, or anything
          else.
        </p>
        <p className="text-xs text-text-muted">
          If you don&apos;t see our reply, or a password reset email, in your
          inbox, please check your spam or junk folder too. It sometimes lands
          there.
        </p>
      </section>

      {CONTACT_PHONE && (
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-text">WhatsApp</h2>
          <p>
            <a
              className="text-accent"
              href={`https://wa.me/${CONTACT_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>{" "}
            is the number to message. Send your paper menu and we&apos;ll get
            you set up.
          </p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">
          Already a customer?
        </h2>
        <p>
          You make most changes yourself from your dashboard, whether that&apos;s
          a price, a new dish, a sold-out item or a deal, and they go live right
          away. Email us if you get stuck.
        </p>
      </section>
    </LegalLayout>
  );
}
