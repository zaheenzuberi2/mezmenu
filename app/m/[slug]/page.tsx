import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicMenu } from "@/lib/data";
import { isSupabaseConfigured, BRAND } from "@/lib/env";
import { SetupNotice } from "@/components/SetupNotice";
import { MenuView } from "./MenuView";

export async function generateMetadata({
  params,
}: PageProps<"/m/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPublicMenu(slug);
  if (!bundle) return { title: "Menu not found" };

  const { restaurant } = bundle;
  return {
    title: `${restaurant.name} - Menu`,
    description:
      restaurant.tagline || `The menu for ${restaurant.name}, on ${BRAND}.`,
    robots: restaurant.is_published ? undefined : { index: false },
    openGraph: {
      title: `${restaurant.name} - Menu`,
      description: restaurant.tagline || `${restaurant.name} on ${BRAND}`,
      type: "website",
    },
  };
}

export default async function MenuPage({
  params,
  searchParams,
}: PageProps<"/m/[slug]">) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const { slug } = await params;
  const sp = await searchParams;
  const bundle = await getPublicMenu(slug);
  if (!bundle) notFound();

  const rawTable = sp.t;
  const tableLabel =
    typeof rawTable === "string" ? rawTable.slice(0, 24).trim() : null;

  return <MenuView bundle={bundle} tableLabel={tableLabel || null} />;
}
