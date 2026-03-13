import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"

const VALID_REGIONS = ["us", "uk", "sg", "hk", "ae", "de", "jp", "cn", "kr"]

const REGION_NAMES: Record<string, string> = {
  us: "United States",
  uk: "United Kingdom",
  sg: "Singapore",
  hk: "Hong Kong",
  ae: "United Arab Emirates",
  de: "Germany",
  jp: "Japan",
  cn: "China",
  kr: "South Korea",
}

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

const PAGE_TITLES: Record<string, string> = {
  "": "AI-Powered Basis Trading",
  "vault": "Your Vault",
  "analytics": "Analytics Dashboard",
  "docs": "Documentation",
  "docs/getting-started": "Getting Started",
  "docs/api": "API Reference",
  "docs/sentry-ai": "Sentry AI Guide",
  "about": "About Us",
  "security": "Security",
  "terms": "Terms of Service",
  "privacy": "Privacy Policy",
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; slug?: string[] }>
}): Promise<Metadata> {
  const { region, slug } = await params
  const path = slug?.join("/") || ""

  const regionName = REGION_NAMES[region] || region.toUpperCase()
  const pageTitle = PAGE_TITLES[path] || "CrimsonArb"

  return {
    title: `${pageTitle} - ${regionName} | CrimsonArb`,
    description: `CrimsonArb AI-powered delta-neutral arbitrage vault - Optimized for institutional traders in ${regionName}`,
    alternates: {
      canonical: `https://crimsonarb.com${path ? `/${path}` : ""}`,
      languages: {
        en: `https://crimsonarb.com${path ? `/${path}` : ""}`,
        "en-US": `https://crimsonarb.com/us${path ? `/${path}` : ""}`,
        "en-GB": `https://crimsonarb.com/uk${path ? `/${path}` : ""}`,
        "en-SG": `https://crimsonarb.com/sg${path ? `/${path}` : ""}`,
        "en-HK": `https://crimsonarb.com/hk${path ? `/${path}` : ""}`,
        "en-AE": `https://crimsonarb.com/ae${path ? `/${path}` : ""}`,
        "de-DE": `https://crimsonarb.com/de${path ? `/${path}` : ""}`,
        "ja-JP": `https://crimsonarb.com/jp${path ? `/${path}` : ""}`,
        "zh-CN": `https://crimsonarb.com/cn${path ? `/${path}` : ""}`,
        "ko-KR": `https://crimsonarb.com/kr${path ? `/${path}` : ""}`,
      },
    },
  }
}

export default async function RegionalPage({
  params,
}: {
  params: Promise<{ region: string; slug?: string[] }>
}) {
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

  const regionName = REGION_NAMES[region] || region.toUpperCase()
  const pageTitle = PAGE_TITLES[path] || "Dashboard"

  // Render a regional landing page with localized content
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-crimson flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">CrimsonArb</span>
            <span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {region.toUpperCase()}
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href={`/${region}/vault`} className="text-muted-foreground hover:text-foreground transition-colors">
              Vault
            </Link>
            <Link href={`/${region}/analytics`} className="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </Link>
            <Link href={`/${region}/docs`} className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link
              href={`/${region}/vault`}
              className="rounded-lg bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-banner.jpg"
            alt={`CrimsonArb AI-Powered Basis Trading - ${regionName}`}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-crimson/30 bg-crimson/10 px-3 py-1 text-xs text-crimson mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson"></span>
            </span>
            Optimized for {regionName}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Delta-neutral arbitrage vault powered by AgentSentry AI on Drift Protocol.
            Institutional-grade trading infrastructure optimized for {regionName} markets.
          </p>
          <Link
            href={`/${region}/vault`}
            className="inline-flex items-center justify-center rounded-lg bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-crimson mb-1">$12.4M</div>
            <div className="text-sm text-muted-foreground">Total Value Locked</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-[#00FF88] mb-1">24.8%</div>
            <div className="text-sm text-muted-foreground">Current APY</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-foreground mb-1">847</div>
            <div className="text-sm text-muted-foreground">Active Vaults</div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Start Trading in {regionName}</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to access AI-powered basis trading strategies.
          </p>
          <Link
            href={`/${region}/vault`}
            className="inline-flex items-center justify-center rounded-lg bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
          >
            Launch App
          </Link>
        </div>
      </main>

      <SiteFooter region={region} />
    </div>
  )
}
