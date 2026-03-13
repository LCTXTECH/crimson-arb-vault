import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"

const VALID_REGIONS = ["us", "uk", "sg", "hk", "ae", "de", "jp", "cn", "kr", "global"]

const VALID_PATHS = [
  "",
  "vault",
  "analytics", 
  "docs",
  "docs/getting-started",
  "docs/api",
  "docs/sentry-ai",
  "about",
  "security",
  "terms",
  "privacy",
]

export async function generateStaticParams() {
  const params = []
  
  for (const region of VALID_REGIONS) {
    // Root region page
    params.push({ region, slug: [] })
    
    // All valid subpaths
    for (const path of VALID_PATHS) {
      if (path) {
        params.push({ region, slug: path.split("/") })
      }
    }
  }
  
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ region: string; slug?: string[] }> }): Promise<Metadata> {
  const { region, slug } = await params
  const path = slug?.join("/") || ""
  
  const regionNames: Record<string, string> = {
    us: "United States",
    uk: "United Kingdom", 
    sg: "Singapore",
    hk: "Hong Kong",
    ae: "UAE",
    de: "Germany",
    jp: "Japan",
    cn: "China",
    kr: "South Korea",
    global: "Global",
  }

  const pageTitle = path ? path.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Dashboard"
  const regionName = regionNames[region] || region.toUpperCase()

  return {
    title: `${pageTitle} - ${regionName} | CrimsonArb`,
    description: `CrimsonArb AI-powered basis trading vault - Optimized for ${regionName}`,
  }
}

export default async function RegionalPage({ params }: { params: Promise<{ region: string; slug?: string[] }> }) {
  const { region, slug } = await params
  
  // Validate region
  if (!VALID_REGIONS.includes(region.toLowerCase())) {
    notFound()
  }

  // Build the path
  const path = slug?.join("/") || ""
  
  // Validate path
  if (path && !VALID_PATHS.includes(path)) {
    notFound()
  }

  // Redirect to the canonical (non-regional) version
  // The middleware will handle setting geo preferences
  const targetPath = path ? `/${path}` : "/"
  redirect(targetPath)
}
