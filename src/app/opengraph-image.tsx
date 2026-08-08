import { ImageResponse } from "next/og";
import { site } from "@/content/site.config";
import { projects } from "@/content/projects";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050816",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6C7590",
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -6,
              color: "#F4F6FB",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              color: "#B8C2D9",
              maxWidth: 900,
            }}
          >
            {site.role}
          </div>
        </div>

        {/* Un point par projet, à son accent : la constellation en réduction */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {projects.map((p) => (
            <div
              key={p.slug}
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: p.accent,
              }}
            />
          ))}
          <div style={{ display: "flex", marginLeft: 16, fontSize: 22, color: "#6C7590" }}>
            7 projets · 4 en ligne
          </div>
        </div>
      </div>
    ),
    size,
  );
}
