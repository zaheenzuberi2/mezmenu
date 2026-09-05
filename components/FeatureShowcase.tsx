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
        <SoldOutIcon className="h-3.5 w-3.5" /> Change it once and every menu
        updates
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
      <div className="relative mt-3 ml-1.5">
        <span
          aria-hidden
          className="absolute -left-1.5 top-0 h-3 w-3 rounded-tl-[3px] bg-[#d9fdd3]"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
        <div className="relative rounded-xl rounded-tl-none bg-[#d9fdd3] px-3.5 py-3 text-xs leading-relaxed text-[#111b21] shadow-sm">
          <p className="font-bold">New order for Al-Rehman Tikka House</p>
          <p className="mt-1 font-bold">Table 5</p>
          <p className="mt-1.5">Chicken Tikka &times;1&nbsp;&nbsp;Rs 320</p>
          <p>Malai Boti &times;1&nbsp;&nbsp;Rs 850</p>
          <p className="mt-1.5 font-semibold">Total so far: Rs 1,170</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-accent">
        <TableNumberIcon className="h-3.5 w-3.5" /> Every order tells you which
        table it came from
      </p>
    </div>
  );
}

const ROW_1_POINTS = [
  {
    icon: PrinterSlashIcon,
    title: "No more paying for reprints",
    body: "Flour, fuel and chicken prices change most weeks. Update yours in the dashboard and every menu shows the new price straight away.",
  },
  {
    icon: SoldOutIcon,
    title: "Mark a dish sold out in one tap",
    body: "If you run out of karahi halfway through service, switch it off from your phone and nobody can order it until you're back in stock.",
  },
  {
    icon: PriceTagIcon,
    title: "Put up a deal whenever you have one",
    body: "A Ramadan platter today, an Eid special tomorrow. It's one line of text, with no design software and no trip to the printer.",
  },
];

const ROW_2_POINTS = [
  {
    icon: NoCommissionIcon,
    title: "No commission, ever",
    body: "Orders come straight to your WhatsApp, so there's no middleman taking a cut of the bill.",
  },
  {
    icon: TableNumberIcon,
    title: "You always know the table",
    body: "Each table has its own QR code, so the order that reaches your phone already says where it came from.",
  },
  {
    icon: WhatsAppOrderIcon,
    title: "The app you already use",
    body: "There's nothing new for the kitchen to learn. Orders arrive on the same WhatsApp your staff checks all day.",
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
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
      {/* Row 1: text left, visual right */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-accent">
            Built around how you run the counter
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Changing a price takes a few seconds
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
          <p className="text-sm font-semibold text-accent">
            Nothing to install
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium">
            Orders land where you already are
          </h2>
          <PointList points={ROW_2_POINTS} />
        </div>
      </div>
      </div>
    </section>
  );
}
