import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { BRAND, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";
import { logoUrl } from "@/lib/logo-url";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-restaurant share image: logo (or an initial), name, tagline. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let name = BRAND;
  let tagline = "";
  let accent = "#b4531f";
  let logo: string | null = null;

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await db
      .from("restaurants")
      .select("name,tagline,brand_color,logo_url")
      .eq("slug", slug)
      .maybeSingle();
    if (data) {
      name = data.name || name;
      tagline = data.tagline || "";
      accent = data.brand_color || accent;
      // The OG renderer (satori/resvg) can't rasterize SVG sources, only
      // raster images - real uploads are always PNG/JPEG (see lib/image.ts),
      // so this only excludes the SVG placeholders scripts/seed-demo.mjs
      // generates for the demo restaurants.
      const rawLogo = logoUrl(data.logo_url);
      logo = rawLogo && !rawLogo.endsWith(".svg") ? rawLogo : null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: accent,
            display: "flex",
          }}
        />

        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            width={160}
            height={160}
            style={{
              borderRadius: 36,
              objectFit: "contain",
              background: "#ffffff",
              border: "1px solid #e7e3dc",
            }}
          />
        ) : (
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 36,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 76,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {name.trim().slice(0, 1).toUpperCase()}
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 64,
            fontWeight: 700,
            color: "#1c1a17",
            textAlign: "center",
            maxWidth: 1000,
            textWrap: "balance",
          }}
        >
          {name}
        </div>

        {tagline && (
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 30,
              color: "#6b6560",
            }}
          >
            {tagline}
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 22,
            fontWeight: 600,
            color: accent,
          }}
        >
          Menu on {BRAND}
        </div>
      </div>
    ),
    size,
  );
}
