import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { BRAND, CONTACT_EMAIL } from "@/lib/env";

export const metadata: Metadata = { title: "Privacy Policy" };

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-text">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <p>
        {BRAND} is a QR-menu service for restaurants, operated by Zaheen Zuberi.
        This policy explains what we collect and why. Questions:{" "}
        <a className="text-accent" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <section className="space-y-2">
        <H>What we collect</H>
        <p>
          <strong className="text-text">Restaurant owners:</strong> the email
          address you sign in with, and the menu content you enter - restaurant
          name, categories, item names, descriptions, prices, your WhatsApp
          number, and table labels.
        </p>
        <p>
          <strong className="text-text">Diners:</strong> nothing that identifies
          you. Your cart is stored only in your own browser. When you send an
          order it goes straight to the restaurant&apos;s WhatsApp - it does not
          pass through {BRAND}.
        </p>
        <p>
          We also keep basic, aggregate usage counts (for example, how many
          times a menu was opened) to run and improve the service.
        </p>
      </section>

      <section className="space-y-2">
        <H>How we use it</H>
        <p>
          Only to provide the service: to show your menu to your diners, let you
          edit it, generate your QR codes, and contact you about your account.
          We do not sell your data or use it for advertising.
        </p>
      </section>

      <section className="space-y-2">
        <H>Who we share it with</H>
        <p>
          Infrastructure providers who host the service on our behalf - Supabase
          (database and authentication), and Netlify and Cloudflare (hosting and
          delivery). They process data only to keep {BRAND} running. We may
          disclose information if required by law.
        </p>
      </section>

      <section className="space-y-2">
        <H>Storage and retention</H>
        <p>
          Data is stored with Supabase. We keep your account and menu data for as
          long as your account is active. Ask us to delete it and we will, within
          30 days, unless we are required to keep it.
        </p>
      </section>

      <section className="space-y-2">
        <H>Your choices</H>
        <p>
          You can edit or remove your menu content at any time from your
          dashboard, and email us to access or delete your account data.
        </p>
      </section>

      <section className="space-y-2">
        <H>Changes</H>
        <p>
          If this policy changes we will update the date above and, for material
          changes, notify account holders by email.
        </p>
      </section>
    </LegalLayout>
  );
}
