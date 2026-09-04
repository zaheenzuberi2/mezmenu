"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getMyRestaurant } from "@/lib/data";
import { slugify, validateSlug } from "@/lib/slug";
import { parsePrice } from "@/lib/money";
import { normalizeWhatsApp } from "@/lib/wa";

/** Load the caller's restaurant or bail. Every mutation below scopes to it. */
async function ownRestaurant() {
  const user = await requireUser();
  const restaurant = await getMyRestaurant();
  if (!restaurant) redirect("/dashboard/start");
  return { user, restaurant, db: await createClient() };
}

function refresh() {
  revalidatePath("/dashboard", "layout");
}

/* ---------------------------------------------------------------- restaurant */

export type CreateState = { error?: string };

export async function createRestaurant(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name) return { error: "Enter your restaurant name." };
  const check = validateSlug(slug);
  if (!check.ok) return { error: check.reason };

  const db = await createClient();
  const { error } = await db
    .from("restaurants")
    .insert({ owner_id: user.id, slug, name });
  if (error) {
    if (error.code === "23505")
      return { error: `The address "${slug}" is taken. Try another.` };
    return { error: error.message };
  }
  redirect("/dashboard");
}

export type SettingsState = { saved?: boolean; error?: string };

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const { restaurant, db } = await ownRestaurant();

  const patch = {
    name: String(formData.get("name") ?? "").trim() || restaurant.name,
    tagline: String(formData.get("tagline") ?? "").trim(),
    announcement: String(formData.get("announcement") ?? "").trim(),
    brand_color: String(formData.get("brand_color") ?? "").trim() || "#0f172a",
    whatsapp_number: normalizeWhatsApp(
      String(formData.get("whatsapp_number") ?? ""),
    ),
    ordering_enabled: formData.get("ordering_enabled") === "on",
  };

  const { error } = await db
    .from("restaurants")
    .update(patch)
    .eq("id", restaurant.id);
  if (error) return { error: error.message };
  refresh();
  return { saved: true };
}

export async function setPublished(next: boolean) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("restaurants")
    .update({ is_published: next })
    .eq("id", restaurant.id);
  refresh();
}

/** Persist (or clear) the restaurant logo path after a Storage upload. */
export async function setLogo(path: string | null) {
  const { restaurant, db } = await ownRestaurant();
  // Only accept a path inside this restaurant's own folder.
  if (path && !path.startsWith(`${restaurant.id}/`)) return;
  await db
    .from("restaurants")
    .update({ logo_url: path })
    .eq("id", restaurant.id);
  refresh();
}

/* ----------------------------------------------------------------- categories */

export async function addCategory(name: string) {
  const { restaurant, db } = await ownRestaurant();
  const clean = name.trim();
  if (!clean) return;
  const { data: last } = await db
    .from("menu_categories")
    .select("sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  await db.from("menu_categories").insert({
    restaurant_id: restaurant.id,
    name: clean,
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  refresh();
}

export async function renameCategory(id: string, name: string) {
  const { restaurant, db } = await ownRestaurant();
  const clean = name.trim();
  if (!clean) return;
  await db
    .from("menu_categories")
    .update({ name: clean })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function setCategoryActive(id: string, active: boolean) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("menu_categories")
    .update({ is_active: active })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function deleteCategory(id: string) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("menu_categories")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function moveCategory(id: string, dir: "up" | "down") {
  const { restaurant, db } = await ownRestaurant();
  const { data: cats } = await db
    .from("menu_categories")
    .select("id, sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });
  if (!cats) return;
  const i = cats.findIndex((c) => c.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= cats.length) return;
  await Promise.all([
    db
      .from("menu_categories")
      .update({ sort_order: cats[j].sort_order })
      .eq("id", cats[i].id),
    db
      .from("menu_categories")
      .update({ sort_order: cats[i].sort_order })
      .eq("id", cats[j].id),
  ]);
  refresh();
}

/* ---------------------------------------------------------------------- items */

export async function addItem(categoryId: string, name: string, price: string) {
  const { restaurant, db } = await ownRestaurant();
  const clean = name.trim();
  if (!clean) return;
  const { data: last } = await db
    .from("menu_items")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  await db.from("menu_items").insert({
    restaurant_id: restaurant.id,
    category_id: categoryId,
    name: clean,
    price: parsePrice(price),
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  refresh();
}

export async function updateItem(
  id: string,
  patch: {
    name?: string;
    description?: string;
    price?: string;
    price_note?: string;
  },
) {
  const { restaurant, db } = await ownRestaurant();
  const next: Record<string, unknown> = {};
  if (patch.name !== undefined) next.name = patch.name.trim();
  if (patch.description !== undefined)
    next.description = patch.description.trim();
  if (patch.price_note !== undefined) next.price_note = patch.price_note.trim();
  if (patch.price !== undefined) next.price = parsePrice(patch.price);
  await db
    .from("menu_items")
    .update(next)
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function setItemAvailable(id: string, available: boolean) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("menu_items")
    .update({ is_available: available })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function setItemFeatured(id: string, featured: boolean) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("menu_items")
    .update({ is_featured: featured })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function deleteItem(id: string) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("menu_items")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}

export async function moveItem(id: string, dir: "up" | "down") {
  const { restaurant, db } = await ownRestaurant();
  const { data: item } = await db
    .from("menu_items")
    .select("id, category_id")
    .eq("id", id)
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();
  if (!item) return;
  const { data: siblings } = await db
    .from("menu_items")
    .select("id, sort_order")
    .eq("category_id", item.category_id)
    .order("sort_order", { ascending: true });
  if (!siblings) return;
  const i = siblings.findIndex((s) => s.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= siblings.length) return;
  await Promise.all([
    db
      .from("menu_items")
      .update({ sort_order: siblings[j].sort_order })
      .eq("id", siblings[i].id),
    db
      .from("menu_items")
      .update({ sort_order: siblings[i].sort_order })
      .eq("id", siblings[j].id),
  ]);
  refresh();
}

/* --------------------------------------------------------------------- tables */

export async function addTable(label: string) {
  const { restaurant, db } = await ownRestaurant();
  const clean = label.trim();
  if (!clean) return;
  const { data: last } = await db
    .from("restaurant_tables")
    .select("sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  await db.from("restaurant_tables").insert({
    restaurant_id: restaurant.id,
    label: clean,
    sort_order: (last?.sort_order ?? -1) + 1,
  });
  refresh();
}

export async function deleteTable(id: string) {
  const { restaurant, db } = await ownRestaurant();
  await db
    .from("restaurant_tables")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  refresh();
}
