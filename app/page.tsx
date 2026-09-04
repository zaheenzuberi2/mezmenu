import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroMenuCard } from "@/components/HeroMenuCard";
import { PhoneFrame } from "@/components/PhoneFrame";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveExamples } from "@/components/LiveExamples";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { PricingCard } from "@/components/PricingCard";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="#pricing"
              className="hidden text-text-muted hover:text-text sm:inline"
            >
              Pricing
            </Link>
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
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-15%] h-[420px] w-[420px] rounded-full bg-accent/25 blur-3xl sm:h-[520px] sm:w-[520px] sm:bg-accent/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-20 left-[-15%] h-[300px] w-[300px] rounded-full bg-gold/20 blur-3xl sm:h-[380px] sm:w-[380px]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-accent">
              QR menus, built for Pakistani restaurants
            </p>
            <h1 className="mt-4 font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.01em] text-text sm:text-6xl">
              Change a price,
              <br />
              <span className="italic text-accent">not</span> the whole menu.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted">
              Your menu, on a QR code you control. Update prices and specials
              from your phone — live instantly, no printer, no commission.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 hover:opacity-95"
              >
                Build my menu free
              </Link>
              <Link
                href="/m/demo-diner"
                className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                See live demo →
              </Link>
            </div>
            <p className="mt-5 text-sm text-text-muted">
              No card required · Setup done for you · Cancel anytime
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneFrame>
              <HeroMenuCard />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <HowItWorks />
      <LiveExamples />
      <FeatureShowcase />
      <PricingCard />

      {/* Closing CTA - deep charcoal band */}
      <section className="relative overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 text-on-ink sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-medium">
              Your menu could be live by tonight
            </h2>
            <p className="mt-2 max-w-md text-sm text-on-ink-muted">
              Send your paper menu on WhatsApp — we&apos;ll set it up for you,
              free.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast shadow-lg shadow-accent/30 hover:opacity-90"
          >
            Build my menu free
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
