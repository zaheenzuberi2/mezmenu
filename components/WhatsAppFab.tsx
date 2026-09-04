"use client";

import { usePathname } from "next/navigation";
import { CONTACT_PHONE } from "@/lib/env";

// Only the marketing surface - not the dashboard, not a diner's own menu
// (that page already has its own WhatsApp ordering flow).
const SHOW_ON = new Set(["/", "/contact", "/privacy", "/terms"]);

export function WhatsAppFab() {
  const pathname = usePathname();
  if (!CONTACT_PHONE || !SHOW_ON.has(pathname)) return null;

  const href = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi! I have a question about MezMenu.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MezMenu support on WhatsApp"
      className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-4 text-sm font-medium text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 sm:bottom-5"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.35-1.28a9.9 9.9 0 0 0 4.69 1.19h.01c5.5 0 9.95-4.46 9.95-9.96C22 6.46 17.54 2 12.04 2Zm5.83 14.24c-.25.7-1.25 1.28-2.03 1.44-.54.11-1.24.2-3.6-.77-3.02-1.25-4.97-4.32-5.12-4.52-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.58c.19 0 .43-.07.68.52.25.6.83 2.06.9 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.48.13.65-.08.17-.2.72-.85.92-1.14.19-.3.38-.24.65-.14.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.13.08.72-.17 1.41Z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}
