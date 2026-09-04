/**
 * Seeds published demo restaurants so the /m/<slug> pages and the landing
 * page's "live examples" render with real data. Idempotent: clears and
 * recreates the demo rows each run.
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

/** A simple monogram logo so the demos show what the feature looks like. */
function monogramSvg(initials, bg) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">` +
      `<rect width="128" height="128" rx="28" fill="${bg}"/>` +
      `<text x="64" y="82" font-size="56" font-family="Georgia, 'Times New Roman', serif" ` +
      `font-weight="600" fill="#ffffff" text-anchor="middle">${initials}</text>` +
      `</svg>`,
  );
}

// one shared demo owner
let ownerId;
{
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list.users.find((u) => u.email === DEMO_EMAIL);
  if (existing) ownerId = existing.id;
  else {
    const { data, error } = await db.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: "demo-" + Math.random().toString(36).slice(2),
      email_confirm: true,
    });
    if (error) throw error;
    ownerId = data.user.id;
  }
}

/** [name, description, price, available, featured, price_note] */
const DEMOS = [
  {
    slug: "demo-diner",
    name: "Al-Rehman Tikka House",
    tagline: "Charcoal BBQ · Gulberg, Lahore",
    announcement: "Ramadan deal: Iftar platter for two — Rs 1,499",
    brand_color: "#7c2d12",
    initials: "AR",
    whatsapp_number: "923001234567",
    ordering_enabled: true,
    menu: [
      ["BBQ", [
        ["Chicken Tikka", "Full leg piece, charcoal grilled", 320, true, true],
        ["Beef Seekh Kabab", "Per skewer", 260, true, false],
        ["Malai Boti", "Half kg", 850, true, true],
        ["Chicken Reshmi Kabab", "Per skewer", 240, false, false],
      ]],
      ["Karahi & Handi", [
        ["Chicken Karahi", "Boneless", null, true, false, "Half 950 · Full 1,750"],
        ["Mutton Karahi", "Full", 2600, true, true],
        ["White Chicken Handi", "Half", 1100, true, false],
      ]],
      ["Breads", [
        ["Roghni Naan", "", 60, true, false],
        ["Garlic Naan", "", 90, true, false],
        ["Tandoori Roti", "", 25, true, false],
      ]],
      ["Drinks", [
        ["Fresh Lime", "", 150, true, false],
        ["Doodh Soda", "", 180, true, false],
        ["Soft Drink", "Regular bottle", 90, true, false],
      ]],
    ],
  },
  {
    slug: "demo-cafe",
    name: "Khwa Coffee Co.",
    tagline: "Specialty coffee & bakes · F-7, Islamabad",
    announcement: "",
    brand_color: "#3f3d56",
    initials: "K",
    whatsapp_number: "923215557788",
    ordering_enabled: true,
    menu: [
      ["Coffee", [
        ["Flat White", "Double shot, whole milk", 520, true, true],
        ["Cortado", "", 480, true, false],
        ["Cold Brew", "16oz, 18-hour steep", 550, true, true],
        ["Pour Over", "Single origin, ask for today's", 620, true, false],
      ]],
      ["Not Coffee", [
        ["Kashmiri Chai", "Pink, cardamom, pistachio", 380, true, false],
        ["Hot Chocolate", "70% dark", 460, true, false],
        ["Fresh Orange Juice", "", 400, false, false],
      ]],
      ["Bakes", [
        ["Butter Croissant", "", 320, true, false],
        ["Pain au Chocolat", "", 360, true, true],
        ["Banana Bread", "Toasted, with butter", 340, true, false],
        ["Cheesecake Slice", "New York style", 550, true, false],
      ]],
    ],
  },
  {
    slug: "demo-burgers",
    name: "Patty Wagon",
    tagline: "Smash burgers · DHA Phase 5, Karachi",
    announcement: "New: Double Truffle — this week only",
    brand_color: "#b91c1c",
    initials: "PW",
    whatsapp_number: "923331119999",
    ordering_enabled: true,
    menu: [
      ["Burgers", [
        ["The Classic Smash", "Single patty, American cheese, house sauce", 690, true, true],
        ["Double Smash", "Two patties, double cheese", 950, true, true],
        ["Crispy Chicken", "Buttermilk-fried thigh, slaw", 780, true, false],
        ["Double Truffle", "Two patties, truffle mayo, Swiss", 1250, true, false],
        ["The Vegetable One", "Black bean patty", 690, false, false],
      ]],
      ["Sides", [
        ["Fries", "Regular", 260, true, false],
        ["Loaded Fries", "Cheese sauce, jalapeño, sauce", 480, true, true],
        ["Onion Rings", "", 320, true, false],
      ]],
      ["Shakes", [
        ["Chocolate Malt", "", 520, true, false],
        ["Salted Caramel", "", 540, true, false],
      ]],
    ],
  },
];

for (const d of DEMOS) {
  await db.from("restaurants").delete().eq("slug", d.slug);
  const { data: r, error } = await db
    .from("restaurants")
    .insert({
      owner_id: ownerId,
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      announcement: d.announcement,
      brand_color: d.brand_color,
      whatsapp_number: d.whatsapp_number,
      ordering_enabled: d.ordering_enabled,
      is_published: true,
    })
    .select()
    .single();
  if (error) throw error;

  // Logo: a simple monogram so the feature is visible on the demos.
  const logoKey = `${r.id}/logo.svg`;
  const { error: logoUpErr } = await db.storage
    .from("restaurant-logos")
    .upload(logoKey, monogramSvg(d.initials, d.brand_color), {
      contentType: "image/svg+xml",
      upsert: true,
    });
  if (logoUpErr) throw logoUpErr;
  const { error: logoSetErr } = await db
    .from("restaurants")
    .update({ logo_url: logoKey })
    .eq("id", r.id);
  if (logoSetErr) throw logoSetErr;

  let catOrder = 0;
  for (const [catName, items] of d.menu) {
    const { data: c, error: cErr } = await db
      .from("menu_categories")
      .insert({ restaurant_id: r.id, name: catName, sort_order: catOrder++ })
      .select()
      .single();
    if (cErr) throw cErr;
    let itemOrder = 0;
    for (const [name, description, price, avail, featured, priceNote] of items) {
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

  await db.from("restaurant_tables").delete().eq("restaurant_id", r.id);
  await db.from("restaurant_tables").insert(
    ["1", "2", "5"].map((label, i) => ({
      restaurant_id: r.id,
      label,
      sort_order: i,
    })),
  );

  console.log(`seeded /m/${d.slug}`);
}
