import { LogoMark } from "@/components/Logo";

const ITEMS = [
  { name: "Chicken Tikka", note: "Charcoal grilled", price: "Rs 320", tag: "Popular" },
  { name: "Mutton Karahi", note: "Half / Full", price: "Rs 1,750" },
  { name: "Malai Boti", note: "Half kg", price: "Rs 850", tag: "Popular" },
  { name: "Reshmi Kabab", note: "Per skewer", price: "Rs 240", soldOut: true },
  { name: "Roghni Naan", note: "", price: "Rs 60" },
];

/**
 * A static preview of a diner menu, styled to look exactly like the real
 * /m/<slug> page (see app/m/[slug]/MenuView.tsx). Decorative - pure markup,
 * no data, no photos - the real product is a text menu by design.
 * Meant to sit inside <PhoneFrame>.
 */
export function HeroMenuCard() {
  return (
    <div>
      {/* header */}
      <div className="border-b border-border bg-surface px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-medium">
            Al-Rehman Tikka House
          </span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-muted">
            Table 5
          </span>
        </div>
        <p className="mt-0.5 text-xs text-text-muted">
          Charcoal BBQ · Gulberg, Lahore
        </p>
        <div className="mt-3 flex gap-1.5">
          {["BBQ", "Karahi", "Breads"].map((c, i) => (
            <span
              key={c}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                i === 0
                  ? "border-accent text-accent"
                  : "border-border text-text-muted"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* deal banner */}
      <div className="mx-4 mt-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
        Ramadan deal: Iftar platter for two — Rs 1,499
      </div>

      {/* items */}
      <ul className="divide-y divide-border px-4 pb-2">
        {ITEMS.map((it) => (
          <li
            key={it.name}
            className={`flex items-start justify-between gap-3 py-3 ${
              it.soldOut ? "opacity-40" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{it.name}</span>
                {it.tag && (
                  <span className="rounded bg-accent/15 px-1 py-0.5 text-[9px] font-semibold uppercase text-accent">
                    {it.tag}
                  </span>
                )}
                {it.soldOut && (
                  <span className="rounded bg-surface-2 px-1 py-0.5 text-[9px] font-semibold uppercase text-text-muted">
                    Sold out
                  </span>
                )}
              </div>
              {it.note && <p className="text-xs text-text-muted">{it.note}</p>}
              <p className="mt-0.5 text-xs font-medium">{it.price}</p>
            </div>
            {!it.soldOut && (
              <span className="mt-0.5 shrink-0 rounded-full border border-accent px-3 py-1 text-xs font-medium text-accent">
                Add
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* order bar */}
      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast">
          <span>View order · 2 items</span>
          <span>Rs 1,170</span>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-text-muted">
          <LogoMark className="h-3 w-3" /> Menu by MezMenu
        </p>
      </div>
    </div>
  );
}
