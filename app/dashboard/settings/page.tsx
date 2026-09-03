import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { requireRestaurant } from "@/lib/data";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireUser();
  const restaurant = await requireRestaurant();
  return <SettingsForm restaurant={restaurant} />;
}
