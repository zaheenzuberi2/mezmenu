import { formatPrice } from "@/lib/money";
import type { CartLine } from "@/lib/types";

/** Strip everything except digits. WhatsApp wants a bare international number. */
export function normalizeWhatsApp(input: string): string {
  let d = input.replace(/[^0-9]/g, "");
  // Common Pakistani entry: 03001234567 -> 923001234567
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return d;
}

type OrderInput = {
  restaurantName: string;
  tableLabel?: string | null;
  lines: CartLine[];
  currency?: string;
};

/** The plain-text order that gets pre-typed into WhatsApp. */
export function buildOrderText({
  restaurantName,
  tableLabel,
  lines,
  currency = "PKR",
}: OrderInput): string {
  const rows = lines.map((l) => {
    const price = l.price != null ? ` - ${formatPrice(l.price * l.qty, currency)}` : "";
    const note = l.note ? ` (${l.note})` : "";
    return `- ${l.qty}x ${l.name}${note}${price}`;
  });

  const total = lines.reduce(
    (sum, l) => (l.price != null ? sum + l.price * l.qty : sum),
    0,
  );

  return [
    `*New order - ${restaurantName}*`,
    tableLabel ? `Table: ${tableLabel}` : null,
    "",
    ...rows,
    "",
    total > 0 ? `Estimated total: ${formatPrice(total, currency)}` : null,
    "",
    "Sent via MezMenu",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function waLink(number: string, text: string): string {
  return `https://wa.me/${normalizeWhatsApp(number)}?text=${encodeURIComponent(text)}`;
}
