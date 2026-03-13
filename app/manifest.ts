import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CrimsonArb Vault",
    short_name: "CrimsonArb",
    description: "Delta-neutral arbitrage vault powered by AgentSentry AI on Drift Protocol",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e14",
    theme_color: "#e63946",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["finance", "cryptocurrency", "defi"],
    lang: "en",
    dir: "ltr",
  }
}
