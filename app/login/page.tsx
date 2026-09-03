import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  if (await getUser()) redirect("/dashboard");

  return (
    <AuthShell
      title="Log in"
      footer={
        <div className="flex items-center justify-between">
          <Link href="/signup" className="font-medium text-text hover:underline">
            Create an account
          </Link>
          <Link href="/forgot" className="hover:text-text">
            Forgot password?
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
