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
          className="pointer-events-none absolute -top-[30%] -right-[22%] h-[70vh] w-[70vh] rounded-full bg-accent/25 blur-3xl sm:-top-[45%] sm:right-[-8%] sm:h-[46rem] sm:w-[46rem] sm:bg-accent/[0.17]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[8%] -left-[25%] h-[60vh] w-[60vh] rounded-full bg-gold/30 blur-3xl sm:-top-[10%] sm:left-[-10%] sm:h-[40rem] sm:w-[40rem] sm:bg-gold/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-35%] left-[15%] h-[45vh] w-[80vw] rounded-full bg-accent/10 blur-3xl sm:w-[46rem]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-9 px-6 pt-8 pb-14 sm:gap-14 sm:pt-14 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div>
            <p className="text-sm font-medium tracking-wide text-accent">
              QR menus, built for Pakistani restaurants
            </p>
            <h1 className="mt-3 font-display text-[2.15rem] font-medium leading-[1.08] tracking-[-0.01em] text-text sm:mt-4 sm:text-6xl sm:leading-[1.05]">
              The <span className="italic text-accent">smartest</span> restaurants
              don&apos;t use paper menus anymore.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted sm:mt-6 sm:text-lg">
              Join the cafés, dhabas, and burger joints running a faster
              floor. Update your daily specials, mark sold-out items
              instantly, and watch orders land directly on your phone.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
              <Link
                href="/m/demo-diner"
                className="rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 hover:opacity-95"
              >
                See Live Demo
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Build my menu free →
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

      {/* Closing CTA - deep espresso band */}
      <section className="glow-ink overflow-hidden bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 text-on-ink sm:flex-row sm:items-center sm:justify-between">
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
