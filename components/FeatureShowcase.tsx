import {
  NoCommissionIcon,
  PriceTagIcon,
  PrinterSlashIcon,
  SoldOutIcon,
  TableNumberIcon,
  WhatsAppOrderIcon,
} from "@/components/icons";

function SoldOutMock() {
  return (
    <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-[var(--shadow)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        BBQ
      </p>
      <ul className="mt-3 divide-y divide-border">
        <li className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">Malai Boti</p>
            <p className="text-xs text-text-muted">Half kg · Rs 850</p>
          </div>
          <span className="rounded-full border border-accent px-3 py-1 text-xs font-medium text-accent">
            Add
          </span>
        </li>
        <li className="flex items-center justify-between py-3 opacity-45">
          <div>
            <p className="text-sm font-medium">Reshmi Kabab</p>
            <p className="text-xs text-text-muted">Per skewer · Rs 240</p>
          </div>
          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-text-muted">
            Sold out
          </span>
        </li>
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-accent">
        <SoldOutIcon className="h-3.5 w-3.5" /> One tap from your dashboard —
        live everywhere instantly
      </p>
    </div>
  );
}

function WhatsAppMock() {
  return (
    <div className="w-full max-w-sm rounded-card border border-border bg-surface p-4 shadow-[var(--shadow)]">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold text-white">
          W
        </div>
        <div>
          <p className="text-sm font-medium">Al-Rehman Tikka House</p>
          <p className="text-[11px] text-text-muted">WhatsApp Business</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl rounded-tl-sm bg-[#DCF8C6] px-3.5 py-3 text-xs leading-relaxed text-[#1b1b1b]">
        <p className="font-semibold">New order — Al-Rehman Tikka House</p>
        <p className="mt-1">Table: 5</p>
        <p className="mt-1">- 1x Chicken Tikka - Rs 320</p>
        <p>- 1x Malai Boti - Rs 850</p>
        <p className="mt-1 font-semibold">Estimated total: Rs 1,170</p>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-accent">
        <TableNumberIcon className="h-3.5 w-3.5" /> Table number attached
        automatically, every time
      </p>
    </div>
  );
}

const ROW_1_POINTS = [
  {
    icon: PrinterSlashIcon,
    title: "Stop paying for reprints",
    body: "Fuel, sugar, chicken — prices move every week. Change yours in the dashboard and it's live everywhere, no printer visit.",
  },
  {
    icon: SoldOutIcon,
    title: "Mark a dish sold out in one tap",
    body: "Ran out of karahi mid-service? Toggle it off from your phone. Diners never order something you can't serve.",
  },
  {
    icon: PriceTagIcon,
    title: "Deals and price notes, whenever you want",
    body: "Ramadan platter today, Eid special tomorrow. One line, no design software, no waiting on a printer.",
  },
];

const ROW_2_POINTS = [
  {
    icon: NoCommissionIcon,
    title: "Zero commission, ever",
    body: "The order goes straight to your WhatsApp. No middleman taking a cut of every bill.",
  },
  {
    icon: TableNumberIcon,
    title: "Table number, every time",
    body: "The QR on each table is unique — the order that lands on your phone already says which table it's for.",
  },
  {
    icon: WhatsAppOrderIcon,
    title: "The app you already use",
    body: "No new dashboard for the kitchen to learn. Orders arrive on the same WhatsApp your staff checks all day.",
  },
];

function PointList({
  points,
}: {
  points: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; body: string }[];
}) {
  return (
    <ul className="mt-6 space-y-5">
      {points.map((p) => (
        <li key={p.title} className="flex gap-3.5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <p.icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-medium">{p.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-text-muted">
              {p.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {/* Row 1: text left, visual right */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Built for how you actually run the counter
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Change a price, not the whole menu
          </h2>
          <PointList points={ROW_1_POINTS} />
        </div>
        <div className="flex justify-center">
          <SoldOutMock />
        </div>
      </div>

      {/* Row 2: visual left, text right */}
      <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1 flex justify-center">
          <WhatsAppMock />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            No app to install, no commission to pay
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Orders land where you already are
          </h2>
          <PointList points={ROW_2_POINTS} />
        </div>
      </div>
    </section>
  );
}
