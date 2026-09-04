import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/env";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#b4531f";

/** Default share image for the marketing site. */
export default async function Image() {
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
            background: ACCENT,
            display: "flex",
          }}
        />

        {/* logo mark */}
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 32,
            background: ACCENT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#ffffff",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                width: 68,
                height: 10,
                borderRadius: 5,
                background: "#ffffff",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 48,
                height: 10,
                borderRadius: 5,
                background: "#ffffff",
                opacity: 0.75,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 84,
            fontWeight: 700,
            color: "#1c1a17",
            letterSpacing: -2,
          }}
        >
          Mez
          <span style={{ color: ACCENT, display: "flex" }}>Menu</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 34,
            color: "#6b6560",
          }}
        >
          Change a price, not the whole menu.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 22,
            fontWeight: 600,
            color: ACCENT,
          }}
        >
          QR menus for restaurants, cafés &amp; dhabas · {BRAND}
        </div>
      </div>
    ),
    size,
  );
}
