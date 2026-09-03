"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slug";
import { FormError, SubmitButton } from "@/components/AuthShell";
import { createRestaurant, type CreateState } from "../actions";

const initial: CreateState = {};
const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

export function StartForm() {
  const [state, formAction, pending] = useActionState(createRestaurant, initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [touched, setTouched] = useState(false);
  const effectiveSlug = touched ? slug : slugify(name);

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
          className={inputClass}
          placeholder="Al-Rehman Tikka House"
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
              setTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className="w-full bg-transparent outline-none"
            placeholder="al-rehman-tikka"
          />
        </div>
      </label>
      <SubmitButton pending={pending}>Continue</SubmitButton>
    </form>
  );
}
