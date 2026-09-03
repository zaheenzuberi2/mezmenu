import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { requireUser } from "@/lib/auth";
import { getMyRestaurant } from "@/lib/data";
import { StartForm } from "./StartForm";

export const metadata: Metadata = { title: "Name your restaurant" };

export default async function StartPage() {
  await requireUser();
  if (await getMyRestaurant()) redirect("/dashboard");

  return (
    <AuthShell
      title="Name your restaurant"
      subtitle="This is the last setup step - then you can build your menu."
    >
      <StartForm />
    </AuthShell>
  );
}
