/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Coreflow - One disciplined system for habits, focus, and training.";
export const size = {
  height: 630,
  width: 1200,
};
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "radial-gradient(circle at 16% 24%, rgba(116,132,255,0.28), transparent 29%), radial-gradient(circle at 84% 18%, rgba(255,176,109,0.18), transparent 28%), radial-gradient(circle at 78% 88%, rgba(255,208,169,0.12), transparent 32%), #05070b",
          color: "#f7f8fb",
          display: "flex",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          height: "100%",
          justifyContent: "center",
          padding: 72,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 36,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: 56,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))",
              display: "flex",
              height: "100%",
              left: 0,
              position: "absolute",
              top: 0,
              width: "100%",
            }}
          />

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 18,
              position: "relative",
            }}
          >
            <img
              alt=""
              height="54"
              src={logoSrc}
              style={{
                borderRadius: 18,
                display: "flex",
                height: 54,
                width: 54,
              }}
              width="54"
            />
            <div
              style={{
                color: "#f7f8fb",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              Coreflow
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 860,
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#f7f8fb",
                fontSize: 72,
                fontWeight: 720,
                lineHeight: 0.98,
              }}
            >
              One disciplined system for habits, focus, and training.
            </div>
            <div
              style={{
                color: "rgba(247,248,251,0.68)",
                fontSize: 27,
                lineHeight: 1.35,
                maxWidth: 690,
              }}
            >
              A personal operating system for consistent execution.
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              color: "rgba(247,248,251,0.48)",
              display: "flex",
              fontSize: 20,
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div>Habits</div>
            <div>Focus</div>
            <div>Training</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
