/** Package purchased. Only "standard" exists today; "pro" is planned. */
export type Plan = "standard" | "pro";

export type Restaurant = {
  id: string;
  owner_id: string;
  slug: string;

  name: string;
  tagline: string;
  /** One-line deal / notice shown as a banner on the menu. Empty = hidden. */
  announcement: string;

  /** Hex, drives the accent colour on the menu page. */
  brand_color: string;
  logo_url: string | null;

  /** Digits only, international format without "+", e.g. 923001234567. */
  whatsapp_number: string;
  /** When false, the menu is view-only and the cart / order button is hidden. */
  ordering_enabled: boolean;
  currency: string;

  is_published: boolean;
  is_paid: boolean;
  plan: Plan;

  created_at: string;
  updated_at: string;
};

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  /** Whole-rupee price. Null when the price is a note instead (see below). */
  price: number | null;
  /** Used when there is no single price: "Market price", "per kg", "Half / Full". */
  price_note: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type RestaurantTable = {
  id: string;
  restaurant_id: string;
  label: string;
  token: string;
  sort_order: number;
  created_at: string;
};

/** Everything the public menu page needs, fetched in one go. */
export type MenuBundle = {
  restaurant: Restaurant;
  categories: MenuCategory[];
  items: MenuItem[];
};

/** A line in the diner's cart (lives in localStorage, never in Postgres). */
export type CartLine = {
  itemId: string;
  name: string;
  price: number | null;
  qty: number;
  note: string;
};
