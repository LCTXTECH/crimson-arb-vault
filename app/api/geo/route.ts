import { NextRequest, NextResponse } from "next/server"
import { GEO_REGIONS, GEO_CONTENT, type GeoRegion } from "@/lib/seo-config"

// GET: Return geo information and localized content
export async function GET(request: NextRequest) {
  const country = request.headers.get("x-user-country") || 
                  request.headers.get("x-vercel-ip-country") || 
                  "US"
  const city = request.headers.get("x-user-city") || 
               request.headers.get("x-vercel-ip-city") || 
               ""
  const region = request.headers.get("x-user-region") || 
                 request.headers.get("x-vercel-ip-country-region") || 
                 ""

  // Determine which geo region to use
  const geoPreference = request.cookies.get("geo-preference")?.value as GeoRegion | undefined
  const detectedRegion = detectRegion(country)
  const activeRegion = geoPreference || detectedRegion

  return NextResponse.json({
    detected: {
      country,
      city: decodeURIComponent(city),
      region,
    },
    activeRegion,
    regionInfo: GEO_REGIONS[activeRegion],
    content: GEO_CONTENT[activeRegion],
    availableRegions: Object.entries(GEO_REGIONS).map(([key, value]) => ({
      key,
      ...value,
    })),
  })
}

// POST: Set geo preference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { region } = body as { region: GeoRegion }

    if (!region || !(region in GEO_REGIONS)) {
      return NextResponse.json(
        { error: "Invalid region" },
        { status: 400 }
      )
    }

    const response = NextResponse.json({
      success: true,
      region,
      regionInfo: GEO_REGIONS[region],
      content: GEO_CONTENT[region],
    })

    // Set geo preference cookie
    response.cookies.set("geo-preference", region, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// Helper to detect region from country code
function detectRegion(country: string): GeoRegion {
  const countryToRegion: Record<string, GeoRegion> = {
    US: "us",
    GB: "uk",
    SG: "sg",
    HK: "hk",
    AE: "ae",
    DE: "de",
    AT: "de",
    CH: "de",
    JP: "jp",
    CN: "cn",
    TW: "cn",
    KR: "kr",
  }

  return countryToRegion[country] || "global"
}
