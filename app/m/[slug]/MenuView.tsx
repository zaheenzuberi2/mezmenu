"use client";

import { useEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { formatPrice } from "@/lib/money";
import { logoUrl } from "@/lib/logo-url";
import { CONTACT_PHONE } from "@/lib/env";
import { buildOrderText, waLink } from "@/lib/wa";
import type { CartLine, MenuBundle, MenuItem } from "@/lib/types";

type CartState = Record<string, { qty: number; note: string }>;

export function MenuView({
  bundle,
  tableLabel,
}: {
  bundle: MenuBundle;
  tableLabel: string | null;
}) {
  const { restaurant, categories, items } = bundle;
  const ordering = restaurant.ordering_enabled && !!restaurant.whatsapp_number;

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active),
    [categories],
  );
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const c of activeCategories) map.set(c.id, []);
    for (const it of items) map.get(it.category_id)?.push(it);
    return map;
  }, [activeCategories, items]);

  const nonEmptyCategories = activeCategories.filter(
    (c) => (itemsByCategory.get(c.id) ?? []).length > 0,
  );

  const cartKey = `mez-cart-${restaurant.id}`;
  const [cart, setCart] = useState<CartState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate the cart from localStorage after mount. Server and first client
  // paint must match (both empty), so this genuinely has to be an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [cartKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, cartKey, hydrated]);

  function setQty(id: string, qty: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = { qty, note: prev[id]?.note ?? "" };
      return next;
    });
  }
  function setNote(id: string, note: string) {
    setCart((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], note } } : prev,
    );
  }

  const itemById = useMemo(() => {
    const m = new Map<string, MenuItem>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  const lines: CartLine[] = Object.entries(cart)
    .map(([id, v]) => {
      const it = itemById.get(id);
      if (!it) return null;
      return {
        itemId: id,
        name: it.name,
        price: it.price,
        qty: v.qty,
        note: v.note,
      } satisfies CartLine;
    })
    .filter((l): l is CartLine => l !== null);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce(
    (s, l) => (l.price != null ? s + l.price * l.qty : s),
    0,
  );

  const orderHref = waLink(
    restaurant.whatsapp_number,
    buildOrderText({
      restaurantName: restaurant.name,
      tableLabel,
      lines,
      currency: restaurant.currency,
    }),
  );

  function jumpTo(id: string) {
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="themed min-h-full pb-28 sm:bg-surface-2"
      style={
        {
          "--brand": restaurant.brand_color || "#b4531f",
        } as React.CSSProperties
      }
    >
      {/* On desktop this reads as a phone-width column, not a stretched
          mobile page - the fixed cart bar / sheet below match the same
          max-w so the whole thing lines up as one "device" panel. */}
      {/* Header */}
      <header className="sticky top-0 z-20 mx-auto border-b border-border bg-bg/90 backdrop-blur sm:max-w-md sm:border-x">
        <div className="mx-auto max-w-md px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {logoUrl(restaurant.logo_url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl(restaurant.logo_url) as string}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg object-contain"
                />
              )}
              <h1 className="truncate text-lg font-semibold tracking-tight">
                {restaurant.name}
              </h1>
            </div>
            {tableLabel && (
              <span className="mt-1 shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted">
                Table {tableLabel}
              </span>
            )}
          </div>
          {restaurant.tagline && (
            <p className="mt-1 truncate text-sm text-text-muted">
              {restaurant.tagline}
            </p>
          )}
          {nonEmptyCategories.length > 1 && (
            <nav className="mt-2 -mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none]">
              {nonEmptyCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => jumpTo(c.id)}
                  className="shrink-0 rounded-full border border-border px-3 py-1 text-sm text-text-muted hover:border-accent hover:text-text"
                >
                  {c.name}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {restaurant.announcement && (
        <div className="mx-auto max-w-md bg-bg px-4 pt-4 sm:border-x sm:border-t-0 sm:border-border">
          <div className="rounded-card border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
            {restaurant.announcement}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-md bg-bg px-4 sm:border-x sm:border-border sm:pb-4">

        {nonEmptyCategories.length === 0 && (
          <p className="py-16 text-center text-sm text-text-muted">
            This menu is being set up. Check back soon.
          </p>
        )}

        {nonEmptyCategories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-32 py-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {c.name}
            </h2>
            <ul className="mt-2 divide-y divide-border">
              {(itemsByCategory.get(c.id) ?? []).map((it) => {
                const qty = cart[it.id]?.qty ?? 0;
                const soldOut = !it.is_available;
                return (
                  <li
                    key={it.id}
                    className={`flex items-start gap-3 py-3 ${
                      soldOut ? "opacity-45" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{it.name}</span>
                        {it.is_featured && !soldOut && (
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                            Popular
                          </span>
                        )}
                        {soldOut && (
                          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                            Sold out
                          </span>
                        )}
                      </div>
                      {it.description && (
                        <p className="mt-0.5 text-sm text-text-muted">
                          {it.description}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-medium">
                        {it.price != null
                          ? formatPrice(it.price, restaurant.currency)
                          : it.price_note || ""}
                      </p>
                    </div>

                    {ordering && !soldOut && (
                      <div className="shrink-0 pt-0.5">
                        {qty === 0 ? (
                          <button
                            onClick={() => setQty(it.id, 1)}
                            className="rounded-full border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-accent-contrast"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-full border border-accent px-1.5 py-1">
                            <button
                              aria-label="Remove one"
                              onClick={() => setQty(it.id, qty - 1)}
                              className="h-6 w-6 rounded-full text-accent hover:bg-accent/10"
                            >
                              −
                            </button>
                            <span className="min-w-4 text-center text-sm font-semibold tabular-nums">
                              {qty}
                            </span>
                            <button
                              aria-label="Add one"
                              onClick={() => setQty(it.id, qty + 1)}
                              className="h-6 w-6 rounded-full text-accent hover:bg-accent/10"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <div className="flex flex-col items-center gap-1 py-8 text-xs text-text-muted">
          <a
            href="https://mezmenu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <LogoMark className="h-4 w-4" /> Menu by MezMenu
          </a>
          {CONTACT_PHONE && (
            <a
              href={`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
                "Hi, I'd like a QR menu for my restaurant.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text"
            >
              Get one for your restaurant
            </a>
          )}
        </div>
      </main>

      {/* Floating cart bar */}
      {ordering && count > 0 && !sheetOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 p-3 backdrop-blur">
          <button
            onClick={() => setSheetOpen(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-full bg-accent px-5 py-3 font-medium text-accent-contrast"
          >
            <span>
              View order, {count} {count === 1 ? "item" : "items"}
            </span>
            {total > 0 && (
              <span className="tabular-nums">
                {formatPrice(total, restaurant.currency)}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Order sheet */}
      {ordering && sheetOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <button
            aria-label="Close"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-bg p-4">
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your order</h2>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="text-sm text-text-muted hover:text-text"
                >
                  Close
                </button>
              </div>
              {tableLabel && (
                <p className="mt-1 text-sm text-text-muted">Table {tableLabel}</p>
              )}

              <ul className="mt-3 divide-y divide-border">
                {lines.map((l) => (
                  <li key={l.itemId} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{l.name}</p>
                        {l.price != null && (
                          <p className="text-sm text-text-muted">
                            {formatPrice(l.price, restaurant.currency)} each
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2 rounded-full border border-border px-1.5 py-1">
                        <button
                          aria-label="Remove one"
                          onClick={() => setQty(l.itemId, l.qty - 1)}
                          className="h-6 w-6 rounded-full hover:bg-surface-2"
                        >
                          −
                        </button>
                        <span className="min-w-4 text-center text-sm font-semibold tabular-nums">
                          {l.qty}
                        </span>
                        <button
                          aria-label="Add one"
                          onClick={() => setQty(l.itemId, l.qty + 1)}
                          className="h-6 w-6 rounded-full hover:bg-surface-2"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      value={l.note}
                      onChange={(e) => setNote(l.itemId, e.target.value)}
                      placeholder="Note (e.g. no chillies)"
                      className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
                    />
                  </li>
                ))}
              </ul>

              {total > 0 && (
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold">
                  <span>Estimated total</span>
                  <span className="tabular-nums">
                    {formatPrice(total, restaurant.currency)}
                  </span>
                </div>
              )}

              <a
                href={orderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 font-medium text-white"
              >
                Send order on WhatsApp
              </a>
              <p className="mt-2 text-center text-xs text-text-muted">
                Opens WhatsApp with your order ready to send to {restaurant.name}.
              </p>
              <button
                onClick={() => setCart({})}
                className="mt-2 w-full py-2 text-center text-sm text-text-muted hover:text-danger"
              >
                Clear order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
