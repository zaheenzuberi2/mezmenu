"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { logoUrl } from "@/lib/logo-url";
import { shrinkImage, extFor } from "@/lib/image";
import { setLogo } from "../actions";

export function LogoUpload({
  restaurantId,
  currentPath,
}: {
  restaurantId: string;
  currentPath: string | null;
}) {
  const [path, setPath] = useState<string | null>(currentPath);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const src = logoUrl(path);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const blob = await shrinkImage(file, 256);
      const key = `${restaurantId}/logo-${Date.now()}.${extFor(blob)}`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("restaurant-logos")
        .upload(key, blob, { contentType: blob.type, upsert: true });
      if (upErr) throw upErr;
      setPath(key);
      start(() => void setLogo(key));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    const old = path;
    setPath(null);
    start(() => void setLogo(null));
    if (old) {
      createClient().storage.from("restaurant-logos").remove([old]);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium">Logo</span>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="Logo" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-text-muted">None</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {busy ? "Uploading…" : src ? "Replace" : "Upload logo"}
          </button>
          {src && (
            <button
              type="button"
              onClick={remove}
              className="text-left text-xs text-text-muted hover:text-danger"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="hidden"
        />
      </div>
      <p className="mt-1 text-xs text-text-muted">
        Optional. Shown at the top of your menu and when the link is shared.
        We shrink it automatically.
      </p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
