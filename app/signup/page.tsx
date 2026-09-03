import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser } from "@/lib/auth";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Start free" };

export default async function SignupPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  if (await getUser()) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your menu"
      subtitle="Two minutes. No card. Your menu is live as soon as you publish it."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-text hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
