/**
 * Seeds one published demo restaurant so /m/demo-diner renders with real data.
 * Idempotent: clears and recreates the demo rows each run.
 *
 *   node scripts/seed-demo.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const DEMO_EMAIL = "demo-owner@mezmenu.local";
const SLUG = "demo-diner";

// 1. A demo owner user
let ownerId;
{
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list.users.find((u) => u.email === DEMO_EMAIL);
  if (existing) {
    ownerId = existing.id;
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: "demo-" + Math.random().toString(36).slice(2),
      email_confirm: true,
    });
    if (error) throw error;
    ownerId = data.user.id;
  }
}

// 2. Reset the demo restaurant
await db.from("restaurants").delete().eq("slug", SLUG);
const { data: r, error: rErr } = await db
  .from("restaurants")
  .insert({
    owner_id: ownerId,
    slug: SLUG,
    name: "Al-Rehman Tikka House",
    tagline: "Charcoal BBQ · Gulberg, Lahore",
    announcement: "Ramadan deal: Iftar platter for two — Rs 1,499",
    brand_color: "#7c2d12",
    whatsapp_number: "923001234567",
    ordering_enabled: true,
    is_published: true,
  })
  .select()
  .single();
if (rErr) throw rErr;

// 3. Categories + items
const menu = [
  {
    name: "BBQ",
    items: [
      ["Chicken Tikka", "Full leg piece, charcoal grilled", 320, true, true],
      ["Beef Seekh Kabab", "Per skewer", 260, true, false],
      ["Malai Boti", "Half kg", 850, true, true],
      ["Chicken Reshmi Kabab", "Per skewer", 240, false, false],
    ],
  },
  {
    name: "Karahi & Handi",
    items: [
      ["Chicken Karahi", "Half / Full", null, true, false, "Half 950 · Full 1,750"],
      ["Mutton Karahi", "Full", 2600, true, true],
      ["White Chicken Handi", "Half", 1100, true, false],
    ],
  },
  {
    name: "Breads",
    items: [
      ["Roghni Naan", "", 60, true, false],
      ["Garlic Naan", "", 90, true, false],
      ["Tandoori Roti", "", 25, true, false],
    ],
  },
  {
    name: "Drinks",
    items: [
      ["Fresh Lime", "", 150, true, false],
      ["Doodh Soda", "", 180, true, false],
      ["Soft Drink", "Regular bottle", 90, true, false],
    ],
  },
];

let catOrder = 0;
for (const cat of menu) {
  const { data: c, error: cErr } = await db
    .from("menu_categories")
    .insert({ restaurant_id: r.id, name: cat.name, sort_order: catOrder++ })
    .select()
    .single();
  if (cErr) throw cErr;

  let itemOrder = 0;
  for (const [name, description, price, avail, featured, priceNote] of cat.items) {
    const { error: iErr } = await db.from("menu_items").insert({
      restaurant_id: r.id,
      category_id: c.id,
      name,
      description: description ?? "",
      price: price ?? null,
      price_note: priceNote ?? "",
      is_available: avail,
      is_featured: featured,
      sort_order: itemOrder++,
    });
    if (iErr) throw iErr;
  }
}

// 4. A couple of tables
await db.from("restaurant_tables").delete().eq("restaurant_id", r.id);
await db.from("restaurant_tables").insert([
  { restaurant_id: r.id, label: "1", sort_order: 0 },
  { restaurant_id: r.id, label: "2", sort_order: 1 },
  { restaurant_id: r.id, label: "5", sort_order: 2 },
]);

console.log(`Seeded /m/${SLUG}  (restaurant ${r.id})`);
