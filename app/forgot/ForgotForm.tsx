"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteUrlClient } from "@/lib/site-url";
import { FormError, SubmitButton } from "@/components/AuthShell";

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <p className="rounded-lg border border-ok/30 bg-ok/10 px-3 py-2 text-sm text-text">
        If that email has an account, a reset link is on its way. Check your
        inbox and spam.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const email = String(new FormData(e.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrlClient()}/auth/callback?next=/reset`,
    });
    setPending(false);
    // Do not reveal whether the email exists.
    if (error && error.status && error.status >= 500) {
      setError("Something went wrong. Try again in a moment.");
      return;
    }
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </label>
      <SubmitButton pending={pending}>Send reset link</SubmitButton>
    </form>
  );
}
