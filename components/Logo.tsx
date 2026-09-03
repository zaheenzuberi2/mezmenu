import { BRAND } from "@/lib/env";

/**
 * MezMenu mark: a rounded tile (the table / QR block) holding a small square
 * and two list bars - "a menu on a code". Colours come from CSS vars so it
 * inverts cleanly in dark mode and can pick up a restaurant's brand accent.
 */
export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={`${BRAND} logo`}
    >
      <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--accent)" />
      <rect x="9" y="8" width="7" height="7" rx="2" fill="var(--accent-contrast)" />
      <rect
        x="9"
        y="18"
        width="14"
        height="2.6"
        rx="1.3"
        fill="var(--accent-contrast)"
      />
      <rect
        x="9"
        y="23"
        width="10"
        height="2.6"
        rx="1.3"
        fill="var(--accent-contrast)"
        opacity="0.75"
      />
    </svg>
  );
}

/** Mark + wordmark, for headers and the footer. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-6 w-6" />
      <span className="text-lg font-semibold tracking-tight">
        Mez<span className="text-accent">Menu</span>
      </span>
    </span>
  );
}
