/**
 * Prices are stored as whole rupees (an integer) and rendered here. PKR has
 * no practical minor unit, so there are no decimals to worry about.
 */

/** 1450 -> "Rs 1,450" */
export function formatPrice(
  value: number | null | undefined,
  currency = "PKR",
): string {
  if (value == null || Number.isNaN(value)) return "";
  const symbol = currency === "PKR" ? "Rs" : currency;
  return `${symbol} ${Math.round(value).toLocaleString("en-PK")}`;
}

/** Parse loose owner input ("1,450", "Rs 1450", "1450.00") into an integer. */
export function parsePrice(input: string): number | null {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Math.round(Number(cleaned));
  return Number.isFinite(n) && n >= 0 ? n : null;
}
