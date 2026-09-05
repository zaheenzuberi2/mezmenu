"use client";

import { useActionState } from "react";
import type { Restaurant } from "@/lib/types";
import { updateSettings, type SettingsState } from "../actions";
import { LogoUpload } from "./LogoUpload";

const initial: SettingsState = {};
const input =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function SettingsForm({ restaurant }: { restaurant: Restaurant }) {
  const [state, action, pending] = useActionState(updateSettings, initial);

  return (
    <form action={action} className="max-w-xl space-y-6">
      <div className="space-y-4 rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold">Restaurant</h2>

        <LogoUpload
          restaurantId={restaurant.id}
          currentPath={restaurant.logo_url}
        />

        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input name="name" defaultValue={restaurant.name} className={input} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Tagline</span>
          <input
            name="tagline"
            defaultValue={restaurant.tagline}
            placeholder="Charcoal BBQ · Gulberg, Lahore"
            className={input}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Deal banner</span>
          <input
            name="announcement"
            defaultValue={restaurant.announcement}
            placeholder="Ramadan deal: iftar platter for two, Rs 1,499"
            className={input}
          />
          <span className="mt-1 block text-xs text-text-muted">
            Shows as a highlighted line at the top of your menu. Leave blank to
            hide it.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Menu accent colour</span>
          <input
            name="brand_color"
            type="color"
            defaultValue={restaurant.brand_color || "#b4531f"}
            className="mt-1 h-10 w-20 rounded border border-border bg-surface"
          />
        </label>
      </div>

      <div className="space-y-4 rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold">Ordering</h2>

        <label className="block">
          <span className="text-sm font-medium">WhatsApp number for orders</span>
          <input
            name="whatsapp_number"
            defaultValue={restaurant.whatsapp_number}
            placeholder="03001234567"
            inputMode="tel"
            className={input}
          />
          <span className="mt-1 block text-xs text-text-muted">
            Orders open in WhatsApp addressed to this number. A leading 0 is
            converted to +92.
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ordering_enabled"
            defaultChecked={restaurant.ordering_enabled}
          />
          <span className="text-sm">
            Let diners send orders on WhatsApp
            <span className="block text-xs text-text-muted">
              Off = a clean view-only menu, no cart.
            </span>
          </span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.saved && (
          <span className="text-sm text-ok">Saved</span>
        )}
        {state.error && (
          <span className="text-sm text-danger">{state.error}</span>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Menu address: <code className="rounded bg-surface-2 px-1">/m/{restaurant.slug}</code>{" "}
        (contact support to change it)
      </p>
    </form>
  );
}
