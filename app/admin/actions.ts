"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/lib/types";

export async function setPaid(restaurantId: string, paid: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("restaurants").update({ is_paid: paid }).eq("id", restaurantId);
  revalidatePath("/admin");
}

export async function setPlan(restaurantId: string, plan: Plan) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("restaurants").update({ plan }).eq("id", restaurantId);
  revalidatePath("/admin");
}
