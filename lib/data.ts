import "server-only";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  MenuBundle,
  MenuCategory,
  MenuItem,
  Restaurant,
  RestaurantTable,
} from "@/lib/types";

async function loadMenu(
  db: SupabaseClient,
  restaurantId: string,
): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const [categories, items] = await Promise.all([
    db
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true }),
    db
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    categories: (categories.data ?? []) as MenuCategory[],
    items: (items.data ?? []) as MenuItem[],
  };
}

/**
 * Public menu lookup for /m/<slug>. Uses the anon client on purpose: RLS is
 * what enforces "published", so an unpublished menu is invisible here even
 * if someone guesses the slug.
 */
export async function getPublicMenu(slug: string): Promise<MenuBundle | null> {
  if (!isSupabaseConfigured) return null;
  const db = await createClient();

  const { data: restaurant } = await db
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!restaurant) return null;

  const { categories, items } = await loadMenu(db, restaurant.id);
  return { restaurant: restaurant as Restaurant, categories, items };
}

/** The signed-in owner's restaurant, if they have one. */
export async function getMyRestaurant(): Promise<Restaurant | null> {
  if (!isSupabaseConfigured) return null;
  const db = await createClient();

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data } = await db
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (data as Restaurant) ?? null;
}

/** Owner's restaurant, or bounce to the create-restaurant step. */
export async function requireRestaurant(): Promise<Restaurant> {
  const restaurant = await getMyRestaurant();
  if (!restaurant) redirect("/dashboard/start");
  return restaurant;
}

/** Full editor bundle for the owner's own restaurant. */
export async function getMyMenu(): Promise<MenuBundle | null> {
  const restaurant = await getMyRestaurant();
  if (!restaurant) return null;

  const db = await createClient();
  const { categories, items } = await loadMenu(db, restaurant.id);
  return { restaurant, categories, items };
}

export async function getMyTables(): Promise<RestaurantTable[]> {
  const restaurant = await getMyRestaurant();
  if (!restaurant) return [];

  const db = await createClient();
  const { data } = await db
    .from("restaurant_tables")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  return (data ?? []) as RestaurantTable[];
}
