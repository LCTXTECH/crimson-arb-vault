import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crimsonarb.com"

/**
 * CrimsonArb Sitemap Generator - Google Search Console Optimized
 * 
 * Submission URL: https://crimsonarb.com/sitemap.xml
 * 
 * Total Pages: 115
 * - 11 Core Pages (canonical URLs without region prefix)
 * - 99 Regional Variants (11 pages x 9 regions with prefix)
 * - 5 Market Pages
 * 
 * Google Search Console Setup:
 * 1. Add property: crimsonarb.com
 * 2. Verify via DNS TXT record or HTML file
 * 3. Submit sitemap: /sitemap.xml
 * 4. Request indexing for priority pages
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
  { path: "", priority: 1.0, changeFrequency: "daily" as const, images: ["/images/hero-banner.jpg", "/images/global-banner.png"] },
  { path: "/vault", priority: 0.9, changeFrequency: "hourly" as const, images: [] },
  { path: "/analytics", priority: 0.8, changeFrequency: "hourly" as const, images: [] },
  { path: "/docs", priority: 0.7, changeFrequency: "weekly" as const, images: [] },
  { path: "/docs/getting-started", priority: 0.7, changeFrequency: "monthly" as const, images: [] },
  { path: "/docs/api", priority: 0.6, changeFrequency: "weekly" as const, images: [] },
  { path: "/docs/sentry-ai", priority: 0.6, changeFrequency: "weekly" as const, images: [] },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const, images: [] },
  { path: "/security", priority: 0.5, changeFrequency: "monthly" as const, images: [] },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const, images: [] },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const, images: [] },
  { path: "/sandbox", priority: 0.8, changeFrequency: "daily" as const, images: [] },
]

// Market pages - maps to /app/markets/[symbol]/page.tsx with full SEO
const MARKETS = [
  { symbol: "sol-perp", priority: 0.9, name: "Solana Perpetual Futures", ticker: "SOL" },
  { symbol: "btc-perp", priority: 0.9, name: "Bitcoin Perpetual Futures", ticker: "BTC" },
  { symbol: "eth-perp", priority: 0.85, name: "Ethereum Perpetual Futures", ticker: "ETH" },
  { symbol: "jto-perp", priority: 0.75, name: "Jito Perpetual Futures", ticker: "JTO" },
  { symbol: "wif-perp", priority: 0.7, name: "dogwifhat Perpetual Futures", ticker: "WIF" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const entries: MetadataRoute.Sitemap = []

  // Generate entries for each core page (11 canonical pages)
  for (const page of CORE_PAGES) {
    // Build hreflang alternates for this page
    const alternateLanguages: Record<string, string> = {}
    for (const region of GEO_REGIONS) {
      if (region.region === "global") {
        // Global/default uses canonical URL without prefix
        alternateLanguages[region.code] = `${BASE_URL}${page.path || "/"}`
      } else {
        // Regional variants use /{region}/ prefix
        alternateLanguages[region.code] = `${BASE_URL}/${region.region}${page.path}`
      }
    }
    // Add x-default for language-neutral fallback
    alternateLanguages["x-default"] = `${BASE_URL}${page.path || "/"}`

    // Main canonical URL (no region prefix)
    entries.push({
      url: `${BASE_URL}${page.path || "/"}`,
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
        priority: Math.round(page.priority * 0.9 * 100) / 100, // Round to 2 decimal places
      })
    }
  }

  // Add dynamic market pages with geo-targeting (5 URLs)
  for (const market of MARKETS) {
    // Build market-specific alternates
    const marketAlternates: Record<string, string> = {}
    for (const region of GEO_REGIONS) {
      marketAlternates[region.code] = `${BASE_URL}/markets/${market.symbol}`
    }
    marketAlternates["x-default"] = `${BASE_URL}/markets/${market.symbol}`

    entries.push({
      url: `${BASE_URL}/markets/${market.symbol}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: market.priority,
      alternates: {
        languages: marketAlternates,
      },
    })
  }

  // Total: 11 canonical + 99 regional + 5 markets = 115 URLs
  return entries
}
