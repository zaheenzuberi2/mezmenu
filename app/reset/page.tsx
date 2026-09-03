import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { SetupNotice } from "@/components/SetupNotice";
import { isSupabaseConfigured } from "@/lib/env";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <AuthShell title="Set a new password">
      <ResetForm />
    </AuthShell>
  );
}
