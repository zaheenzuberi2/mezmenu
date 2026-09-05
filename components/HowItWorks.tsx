import { PhoneEditIcon, QrPrintIcon, WhatsAppOrderIcon } from "@/components/icons";

const STEPS = [
  {
    icon: PhoneEditIcon,
    title: "Build your menu from your phone",
    body: "Add your categories, dishes and prices. It takes a few minutes and you don't need any design skills.",
  },
  {
    icon: QrPrintIcon,
    title: "Print your table QR codes once",
    body: "One sheet covers every table, and you never have to reprint it when a price changes.",
  },
  {
    icon: WhatsAppOrderIcon,
    title: "Diners scan, and the order comes to WhatsApp",
    body: "It arrives on the same number you already keep an eye on, with the table number attached.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[-10%] h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-accent">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Most restaurants are set up within a day
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
