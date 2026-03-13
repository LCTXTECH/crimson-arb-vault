import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crimsonarb.com"

/**
 * CrimsonArb Sitemap Generator
 * 
 * Total Pages: 115
 * - 11 Core Pages (canonical URLs without region prefix)
 * - 99 Regional Variants (11 pages x 9 regions with prefix)
 * - 5 Market Pages
 * 
 * All URLs map to actual Next.js routes:
 * - Core pages: /app/[route]/page.tsx
 * - Regional: /app/[region]/[[...slug]]/page.tsx
 * - Markets: /app/markets/[symbol]/page.tsx
 */

// Define all supported regions for geo-targeting (9 regional + 1 global default)
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

// Core pages - these map to actual /app/[route]/page.tsx files
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

// Market pages - maps to /app/markets/[symbol]/page.tsx with full SEO
const MARKETS = [
  { symbol: "sol-perp", priority: 0.9, name: "Solana Perpetual Futures" },
  { symbol: "btc-perp", priority: 0.9, name: "Bitcoin Perpetual Futures" },
  { symbol: "eth-perp", priority: 0.85, name: "Ethereum Perpetual Futures" },
  { symbol: "jto-perp", priority: 0.75, name: "Jito Perpetual Futures" },
  { symbol: "wif-perp", priority: 0.7, name: "dogwifhat Perpetual Futures" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Generate entries for each core page (11 canonical pages)
  for (const page of CORE_PAGES) {
    // Build hreflang alternates for this page
    const alternateLanguages: Record<string, string> = {}
    for (const region of GEO_REGIONS) {
      if (region.region === "global") {
        // Global/default uses canonical URL without prefix
        alternateLanguages[region.code] = `${BASE_URL}${page.path}`
      } else {
        // Regional variants use /{region}/ prefix
        alternateLanguages[region.code] = `${BASE_URL}/${region.region}${page.path}`
      }
    }

    // Main canonical URL (no region prefix)
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: alternateLanguages,
      },
    })

    // Regional variant URLs (9 regions x 11 pages = 99 URLs)
    for (const region of GEO_REGIONS) {
      if (region.region === "global") continue // Skip global as it's the canonical

      entries.push({
        url: `${BASE_URL}/${region.region}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority * 0.9,
      })
    }
  }

  // Add dynamic market pages with geo-targeting (5 URLs)
  for (const market of MARKETS) {
    entries.push({
      url: `${BASE_URL}/markets/${market.symbol}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: market.priority,
      alternates: {
        languages: {
          "en": `${BASE_URL}/markets/${market.symbol}`,
          "en-US": `${BASE_URL}/markets/${market.symbol}`,
          "en-GB": `${BASE_URL}/markets/${market.symbol}`,
          "en-SG": `${BASE_URL}/markets/${market.symbol}`,
          "en-HK": `${BASE_URL}/markets/${market.symbol}`,
          "en-AE": `${BASE_URL}/markets/${market.symbol}`,
          "de-DE": `${BASE_URL}/markets/${market.symbol}`,
          "ja-JP": `${BASE_URL}/markets/${market.symbol}`,
          "zh-CN": `${BASE_URL}/markets/${market.symbol}`,
          "ko-KR": `${BASE_URL}/markets/${market.symbol}`,
        },
      },
    })
  }

  // Total: 11 canonical + 99 regional + 5 markets = 115 URLs
  return entries
}
