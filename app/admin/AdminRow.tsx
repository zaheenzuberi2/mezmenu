"use client";

import { useTransition } from "react";
import type { Plan, Restaurant } from "@/lib/types";
import { setPaid, setPlan } from "./actions";

export function AdminRow({
  restaurant,
  ownerEmail,
  origin,
}: {
  restaurant: Restaurant;
  ownerEmail: string;
  origin: string;
}) {
  const [pending, start] = useTransition();

  return (
    <tr className={pending ? "opacity-50" : ""}>
      <td className="px-3 py-2">
        <a
          href={`${origin}/m/${restaurant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
        >
          {restaurant.name || restaurant.slug}
        </a>
        <div className="text-xs text-text-muted">/m/{restaurant.slug}</div>
      </td>
      <td className="px-3 py-2 text-text-muted">{ownerEmail}</td>
      <td className="px-3 py-2">
        <select
          value={restaurant.plan}
          onChange={(e) =>
            start(() => void setPlan(restaurant.id, e.target.value as Plan))
          }
          className="rounded border border-border bg-surface px-2 py-1 text-xs"
        >
          <option value="standard">standard</option>
          <option value="pro">pro</option>
        </select>
      </td>
      <td className="px-3 py-2">
        {restaurant.is_published ? (
          <span className="text-ok">● live</span>
        ) : (
          <span className="text-text-muted">draft</span>
        )}
      </td>
      <td className="px-3 py-2">
        <button
          onClick={() => start(() => void setPaid(restaurant.id, !restaurant.is_paid))}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            restaurant.is_paid
              ? "bg-ok/15 text-ok"
              : "border border-border text-text-muted"
          }`}
        >
          {restaurant.is_paid ? "paid" : "mark paid"}
        </button>
      </td>
      <td className="px-3 py-2 text-xs text-text-muted">
        {new Date(restaurant.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
    </tr>
  );
}
