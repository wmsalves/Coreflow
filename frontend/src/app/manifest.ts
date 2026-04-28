import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Coreflow",
    short_name: "Coreflow",
    description: "A personal execution system for disciplined people.",
    scope: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1eb",
    theme_color: "#f8f4ee",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
