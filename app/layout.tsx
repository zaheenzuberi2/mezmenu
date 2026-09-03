import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { BRAND } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Classic, warm display serif for headlines.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND} - QR menus for restaurants`,
    template: `%s - ${BRAND}`,
  },
  description:
    "Put your menu on a QR code. Edit prices in seconds, mark items sold out, take orders on WhatsApp. No reprinting.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
