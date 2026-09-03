import Link from "next/link";
import { BRAND } from "@/lib/env";

/** Shared marketing footer: legal links + portfolio credit. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND} · A project by{" "}
          <a
            href="https://zaheenzuberi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text underline-offset-2 hover:underline"
          >
            Zaheen Zuberi
          </a>
        </p>
        <nav className="flex gap-5">
          <Link href="/privacy" className="hover:text-text">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-text">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
