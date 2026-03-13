import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Supported regions for geo-routing
const SUPPORTED_REGIONS = ["us", "uk", "sg", "hk", "ae", "de", "jp", "cn", "kr"] as const
type SupportedRegion = (typeof SUPPORTED_REGIONS)[number]

// Map Vercel geo country codes to our regions
const COUNTRY_TO_REGION: Record<string, SupportedRegion> = {
  US: "us",
  GB: "uk",
  SG: "sg",
  HK: "hk",
  AE: "ae",
  DE: "de",
  AT: "de", // Austria -> German content
  CH: "de", // Switzerland -> German content
  JP: "jp",
  CN: "cn",
  TW: "cn", // Taiwan -> Chinese content
  KR: "kr",
}

// Paths that should not be geo-routed
const EXCLUDED_PATHS = [
  "/api",
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
]

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const response = NextResponse.next()

  // Skip excluded paths
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return response
  }

  // Skip if already on a regional path
  if (SUPPORTED_REGIONS.some((region) => pathname.startsWith(`/${region}`))) {
    // Add geo headers for analytics
    const country = request.headers.get("x-vercel-ip-country") || "US"
    response.headers.set("x-user-country", country)
    return response
  }

  // Get user's country from Vercel's geo headers
  const country = request.headers.get("x-vercel-ip-country") || "US"
  const city = request.headers.get("x-vercel-ip-city") || ""
  const region = request.headers.get("x-vercel-ip-country-region") || ""

  // Set geo headers for downstream use
  response.headers.set("x-user-country", country)
  response.headers.set("x-user-city", city)
  response.headers.set("x-user-region", region)

  // Check for geo preference cookie (user override)
  const geoPreference = request.cookies.get("geo-preference")?.value
  if (geoPreference && SUPPORTED_REGIONS.includes(geoPreference as SupportedRegion)) {
    // User has manually selected a region, respect it
    return response
  }

  // Auto-redirect based on IP geolocation (only for initial visits)
  const hasVisited = request.cookies.get("visited")?.value
  if (!hasVisited && COUNTRY_TO_REGION[country]) {
    const targetRegion = COUNTRY_TO_REGION[country]
    const url = request.nextUrl.clone()
    url.pathname = `/${targetRegion}${pathname}`
    url.search = search

    const redirectResponse = NextResponse.redirect(url, 302)
    // Set cookie to prevent redirect loops
    redirectResponse.cookies.set("visited", "true", {
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
