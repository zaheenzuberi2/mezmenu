"use client";

import { useState, useTransition } from "react";
import { formatPrice } from "@/lib/money";
import type { MenuBundle, MenuCategory, MenuItem } from "@/lib/types";
import {
  addCategory,
  addItem,
  deleteCategory,
  deleteItem,
  moveCategory,
  moveItem,
  renameCategory,
  setCategoryActive,
  setItemAvailable,
  setItemFeatured,
  setPublished,
  updateItem,
} from "./actions";

const input =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function MenuEditor({
  bundle,
  origin,
}: {
  bundle: MenuBundle;
  origin: string;
}) {
  const { restaurant, categories, items } = bundle;
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>) => start(() => void fn());

  const itemsByCat = new Map<string, MenuItem[]>();
  for (const c of categories) itemsByCat.set(c.id, []);
  for (const it of items) itemsByCat.get(it.category_id)?.push(it);

  const liveUrl = `${origin}/m/${restaurant.slug}`;

  return (
    <div className={pending ? "pointer-events-none opacity-70" : ""}>
      {/* Publish state */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface p-4">
        {restaurant.is_published ? (
          <div className="text-sm">
            <span className="font-medium text-ok">● Live</span>{" "}
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted underline-offset-2 hover:underline"
            >
              {liveUrl.replace(/^https?:\/\//, "")}
            </a>
          </div>
        ) : (
          <div className="text-sm text-text-muted">
            Your menu is not live yet. Diners cannot see it.
          </div>
        )}
        <button
          onClick={() => run(() => setPublished(!restaurant.is_published))}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            restaurant.is_published
              ? "border border-border text-text-muted hover:text-text"
              : "bg-accent text-accent-contrast hover:opacity-90"
          }`}
        >
          {restaurant.is_published ? "Unpublish" : "Publish menu"}
        </button>
      </div>

      {categories.length === 0 && (
        <p className="mb-4 rounded-card border border-dashed border-border p-6 text-center text-sm text-text-muted">
          Start by adding a category - like &ldquo;BBQ&rdquo;, &ldquo;Karahi&rdquo;
          or &ldquo;Drinks&rdquo;.
        </p>
      )}

      <div className="space-y-5">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            items={itemsByCat.get(cat.id) ?? []}
            first={idx === 0}
            last={idx === categories.length - 1}
            currency={restaurant.currency}
            run={run}
          />
        ))}
      </div>

      <AddCategory run={run} />
    </div>
  );
}

/* --------------------------------------------------------------- category */

function CategoryCard({
  cat,
  items,
  first,
  last,
  currency,
  run,
}: {
  cat: MenuCategory;
  items: MenuItem[];
  first: boolean;
  last: boolean;
  currency: string;
  run: (fn: () => Promise<unknown>) => void;
}) {
  const [name, setName] = useState(cat.name);
  const [editingName, setEditingName] = useState(false);

  return (
    <section
      className={`rounded-card border border-border bg-surface ${
        cat.is_active ? "" : "opacity-60"
      }`}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (name.trim() && name !== cat.name)
                run(() => renameCategory(cat.id, name));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setName(cat.name);
                setEditingName(false);
              }
            }}
            className={`${input} flex-1`}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex-1 text-left font-semibold"
          >
            {cat.name || "Untitled"}
          </button>
        )}

        <IconBtn label="Move up" disabled={first} onClick={() => run(() => moveCategory(cat.id, "up"))}>
          ↑
        </IconBtn>
        <IconBtn label="Move down" disabled={last} onClick={() => run(() => moveCategory(cat.id, "down"))}>
          ↓
        </IconBtn>
        <button
          onClick={() => run(() => setCategoryActive(cat.id, !cat.is_active))}
          className="rounded px-2 py-1 text-xs text-text-muted hover:bg-surface-2"
        >
          {cat.is_active ? "Hide" : "Show"}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${cat.name}" and its items?`))
              run(() => deleteCategory(cat.id));
          }}
          className="rounded px-2 py-1 text-xs text-text-muted hover:text-danger"
        >
          Delete
        </button>
      </header>

      <ul className="divide-y divide-border">
        {items.map((it, i) => (
          <ItemRow
            key={it.id}
            item={it}
            first={i === 0}
            last={i === items.length - 1}
            currency={currency}
            run={run}
          />
        ))}
        {items.length === 0 && (
          <li className="px-4 py-3 text-sm text-text-muted">No items yet.</li>
        )}
      </ul>

      <AddItem categoryId={cat.id} run={run} />
    </section>
  );
}

/* ------------------------------------------------------------------- item */

function ItemRow({
  item,
  first,
  last,
  currency,
  run,
}: {
  item: MenuItem;
  first: boolean;
  last: boolean;
  currency: string;
  run: (fn: () => Promise<unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: item.name,
    description: item.description,
    price: item.price != null ? String(item.price) : "",
    price_note: item.price_note,
  });

  function save() {
    run(() => updateItem(item.id, form));
    setOpen(false);
  }

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-medium ${item.is_available ? "" : "line-through opacity-60"}`}>
              {item.name}
            </span>
            {item.is_featured && (
              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-accent">
                Popular
              </span>
            )}
            {!item.is_available && (
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-text-muted">
                Sold out
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted">
            {item.price != null
              ? formatPrice(item.price, currency)
              : item.price_note || "No price"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconBtn label="Move up" disabled={first} onClick={() => run(() => moveItem(item.id, "up"))}>
            ↑
          </IconBtn>
          <IconBtn label="Move down" disabled={last} onClick={() => run(() => moveItem(item.id, "down"))}>
            ↓
          </IconBtn>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={item.is_available}
            onChange={(e) => run(() => setItemAvailable(item.id, e.target.checked))}
          />
          In stock
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={item.is_featured}
            onChange={(e) => run(() => setItemFeatured(item.id, e.target.checked))}
          />
          Popular
        </label>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-accent hover:underline"
        >
          {open ? "Close" : "Edit"}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${item.name}"?`)) run(() => deleteItem(item.id));
          }}
          className="text-text-muted hover:text-danger"
        >
          Delete
        </button>
      </div>

      {open && (
        <div className="mt-3 grid gap-2 rounded-lg bg-surface-2 p-3 sm:grid-cols-2">
          <input
            className={input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className={input}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price in rupees (leave blank if none)"
            inputMode="numeric"
          />
          <input
            className={`${input} sm:col-span-2`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
          />
          <input
            className={`${input} sm:col-span-2`}
            value={form.price_note}
            onChange={(e) => setForm({ ...form, price_note: e.target.value })}
            placeholder='Price note, e.g. "Half 950 · Full 1,750" (used when no price)'
          />
          <div className="sm:col-span-2">
            <button
              onClick={save}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-contrast hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ---------------------------------------------------------------- add forms */

function AddItem({
  categoryId,
  run,
}: {
  categoryId: string;
  run: (fn: () => Promise<unknown>) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function submit() {
    if (!name.trim()) return;
    run(() => addItem(categoryId, name, price));
    setName("");
    setPrice("");
  }

  return (
    <div className="flex gap-2 border-t border-border p-3">
      <input
        className={`${input} flex-1`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Add an item…"
      />
      <input
        className={`${input} w-28`}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Rs"
        inputMode="numeric"
      />
      <button
        onClick={submit}
        className="rounded-full bg-accent px-4 text-sm font-medium text-accent-contrast hover:opacity-90"
      >
        Add
      </button>
    </div>
  );
}

function AddCategory({ run }: { run: (fn: () => Promise<unknown>) => void }) {
  const [name, setName] = useState("");
  function submit() {
    if (!name.trim()) return;
    run(() => addCategory(name));
    setName("");
  }
  return (
    <div className="mt-5 flex gap-2">
      <input
        className={`${input} flex-1`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Add a category…"
      />
      <button
        onClick={submit}
        className="shrink-0 whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
      >
        Add category
      </button>
    </div>
  );
}

function IconBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="h-7 w-7 rounded text-text-muted hover:bg-surface-2 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
