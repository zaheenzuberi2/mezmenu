import { PhoneEditIcon, QrPrintIcon, WhatsAppOrderIcon } from "@/components/icons";

const STEPS = [
  {
    icon: PhoneEditIcon,
    title: "Build your menu from your phone",
    body: "Type in your categories, dishes and prices. Takes minutes, no design skill needed.",
  },
  {
    icon: QrPrintIcon,
    title: "Print your table QR codes — once",
    body: "One sheet, every table covered. You never reprint for a price change again.",
  },
  {
    icon: WhatsAppOrderIcon,
    title: "Diners scan, order, straight to WhatsApp",
    body: "The order lands on the number you already watch, table number included.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Live in one sitting, not one week
          </h2>
        </div>

        <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-7 left-[16.5%] right-[16.5%] hidden border-t border-dashed border-border sm:block"
          />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex items-center gap-3">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-accent shadow-[var(--shadow)] ring-1 ring-border">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-2xl text-border sm:hidden">
                  {i + 1}
                </span>
              </div>
              <p className="mt-4 font-semibold">{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
