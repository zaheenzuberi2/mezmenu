import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/lib/env";

/** Shared marketing footer: brand, legal links, portfolio credit. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-24 sm:pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              QR menus for restaurants, cafés and dhabas. Edit prices yourself,
              no reprinting.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/privacy" className="text-text-muted hover:text-text">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-muted hover:text-text">
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" className="text-text-muted hover:text-text">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-text-muted">
          © {new Date().getFullYear()} {BRAND}. A project by{" "}
          <a
            href="https://zaheenzuberi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text underline-offset-2 hover:underline"
          >
            Zaheen Zuberi
          </a>
          .
        </div>
      </div>
    </footer>
  );
}

/** Compact one-line footer for auth screens. */
export function AuthFooter() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-text-muted">
      <Link href="/privacy" className="hover:text-text">
        Privacy
      </Link>
      <Link href="/terms" className="hover:text-text">
        Terms
      </Link>
      <Link href="/contact" className="hover:text-text">
        Contact
      </Link>
      <span>© {new Date().getFullYear()} {BRAND}</span>
    </div>
  );
}
