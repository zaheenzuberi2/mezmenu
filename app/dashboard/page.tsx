import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getMyMenu, requireRestaurant } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import { MenuEditor } from "./MenuEditor";

export const metadata: Metadata = { title: "Menu" };

export default async function DashboardPage() {
  await requireUser();
  await requireRestaurant();
  const bundle = await getMyMenu();
  if (!bundle) return null;

  return <MenuEditor bundle={bundle} origin={siteUrl()} />;
}
