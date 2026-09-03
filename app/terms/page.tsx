import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND, PRICE_STANDARD } from "@/lib/env";

export const metadata: Metadata = { title: "Terms & Conditions" };

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-text">{children}</h2>;
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="September 2026">
      <p>
        These terms govern your use of {BRAND}, a QR-menu service operated by
        Zaheen Zuberi. By creating an account you agree to them.
      </p>

      <section className="space-y-2">
        <H>The service</H>
        <p>
          {BRAND} hosts your restaurant menu at a web address and generates QR
          codes for it. The Standard plan is {PRICE_STANDARD} per month. Setup -
          getting your menu online - is included at no charge. Features may
          change as the product develops.
        </p>
      </section>

      <section className="space-y-2">
        <H>Your account and content</H>
        <p>
          You are responsible for the accuracy of everything on your menu,
          including prices and availability, and for keeping your login secure.
          You must not upload unlawful content or anything you do not have the
          right to use.
        </p>
        <p>
          You keep ownership of your menu content. You grant {BRAND} the licence
          needed to store, display and back it up in order to run the service.
        </p>
      </section>

      <section className="space-y-2">
        <H>Orders</H>
        <p>
          Where ordering is enabled, {BRAND} only pre-fills a WhatsApp message
          for the diner to send to you. The order, its acceptance, fulfilment and
          payment are entirely between you and the diner. {BRAND} is not a party
          to any transaction.
        </p>
      </section>

      <section className="space-y-2">
        <H>Payment</H>
        <p>
          Subscription fees are billed monthly. If payment is not received we may
          suspend your menu until the account is brought up to date. Fees paid
          are non-refundable except where required by law.
        </p>
      </section>

      <section className="space-y-2">
        <H>Availability</H>
        <p>
          We work to keep {BRAND} available and accurate but provide it &quot;as
          is&quot;, without warranty of uninterrupted or error-free operation.
        </p>
      </section>

      <section className="space-y-2">
        <H>Liability</H>
        <p>
          To the extent permitted by law, {BRAND}&apos;s total liability for any
          claim relating to the service is limited to the fees you paid in the
          three months before the claim. We are not liable for lost profits or
          indirect losses.
        </p>
      </section>

      <section className="space-y-2">
        <H>Termination</H>
        <p>
          You may cancel at any time from your dashboard or by emailing us. We
          may suspend or end an account that breaches these terms. On termination
          your menu stops being served; your data is deleted per the{" "}
          <a className="text-accent" href="/privacy">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <H>Governing law</H>
        <p>These terms are governed by the laws of Pakistan.</p>
      </section>

      <section className="space-y-2">
        <H>Contact</H>
        <p>
          <a className="text-accent" href="mailto:hello@mezmenu.pk">
            hello@mezmenu.pk
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
