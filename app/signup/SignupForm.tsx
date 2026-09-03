"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slug";
import { FormError, SubmitButton } from "@/components/AuthShell";
import { signup, type SignupState } from "./actions";

const initial: SignupState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(name);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <label className="block">
        <span className="text-sm font-medium">Restaurant name</span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="organization"
          placeholder="Al-Rehman Tikka House"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Menu web address</span>
        <div className="mt-1 flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-within:border-accent">
          <span className="shrink-0 text-text-muted">/m/</span>
          <input
            name="slug"
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="al-rehman-tikka"
            className="w-full bg-transparent outline-none"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-text-muted">
          At least 8 characters.
        </span>
      </label>

      <SubmitButton pending={pending}>Create my menu</SubmitButton>
    </form>
  );
}
