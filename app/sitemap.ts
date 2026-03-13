import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crimsonarb.com"

// Define all supported regions for geo-targeting
const GEO_REGIONS = [
  { code: "en", region: "global", name: "Global" },
  { code: "en-US", region: "us", name: "United States" },
  { code: "en-GB", region: "uk", name: "United Kingdom" },
  { code: "en-SG", region: "sg", name: "Singapore" },
  { code: "en-HK", region: "hk", name: "Hong Kong" },
  { code: "en-AE", region: "ae", name: "United Arab Emirates" },
  { code: "de-DE", region: "de", name: "Germany" },
  { code: "ja-JP", region: "jp", name: "Japan" },
  { code: "zh-CN", region: "cn", name: "China" },
  { code: "ko-KR", region: "kr", name: "South Korea" },
] as const

// Core pages that exist in all regions
const CORE_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/vault", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/analytics", priority: 0.8, changeFrequency: "hourly" as const },
  { path: "/docs", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/docs/getting-started", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/docs/api", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/docs/sentry-ai", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/security", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Generate entries for each core page
  for (const page of CORE_PAGES) {
    // Main URL (default/global)
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: GEO_REGIONS.reduce(
          (acc, region) => {
            acc[region.code] = `${BASE_URL}/${region.region}${page.path}`
            return acc
          },
          {} as Record<string, string>
        ),
      },
    })

    // Regional variants
    for (const region of GEO_REGIONS) {
      if (region.region === "global") continue // Skip global as it's the default

      entries.push({
        url: `${BASE_URL}/${region.region}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority * 0.9, // Slightly lower priority for regional variants
      })
    }
  }

  // Add dynamic market pages
  const MARKETS = ["SOL-PERP", "BTC-PERP", "ETH-PERP", "JTO-PERP", "WIF-PERP"]
  for (const market of MARKETS) {
    entries.push({
      url: `${BASE_URL}/markets/${market.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    })
  }

  return entries
}
