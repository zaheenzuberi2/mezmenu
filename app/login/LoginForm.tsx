"use client";

import { useActionState } from "react";
import { FormError, SubmitButton } from "@/components/AuthShell";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

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

      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      <SubmitButton pending={pending}>Log in</SubmitButton>
    </form>
  );
}
