import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

const VALID_MARKETS = ["sol-perp", "btc-perp", "eth-perp", "jto-perp", "wif-perp"]

const MARKET_INFO: Record<string, { name: string; description: string }> = {
  "sol-perp": { name: "SOL-PERP", description: "Solana perpetual futures market on Drift Protocol" },
  "btc-perp": { name: "BTC-PERP", description: "Bitcoin perpetual futures market on Drift Protocol" },
  "eth-perp": { name: "ETH-PERP", description: "Ethereum perpetual futures market on Drift Protocol" },
  "jto-perp": { name: "JTO-PERP", description: "Jito perpetual futures market on Drift Protocol" },
  "wif-perp": { name: "WIF-PERP", description: "dogwifhat perpetual futures market on Drift Protocol" },
}

export async function generateStaticParams() {
  return VALID_MARKETS.map((symbol) => ({ symbol }))
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params
  const market = MARKET_INFO[symbol.toLowerCase()]
  
  if (!market) {
    return { title: "Market Not Found | CrimsonArb" }
  }

  return {
    title: `${market.name} Market | CrimsonArb`,
    description: market.description,
  }
}

export default async function MarketPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params
  const market = MARKET_INFO[symbol.toLowerCase()]

  if (!market) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">{market.name}</h1>
        <p className="text-muted-foreground text-lg mb-12">
          {market.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-sm text-muted-foreground mb-2">Current Funding Rate</h3>
            <p className="text-3xl font-bold text-crimson">+0.0125%</p>
            <p className="text-sm text-muted-foreground mt-1">45.6% APY</p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-sm text-muted-foreground mb-2">24h Volume</h3>
            <p className="text-3xl font-bold">$847.2M</p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-sm text-muted-foreground mb-2">Open Interest</h3>
            <p className="text-3xl font-bold">$234.5M</p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-sm text-muted-foreground mb-2">Sentry Status</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF88]"></span>
              </span>
              <span className="text-lg font-semibold text-[#00FF88]">Monitoring</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-crimson/30 bg-crimson/5">
          <h3 className="text-lg font-semibold text-crimson mb-2">Trade this market</h3>
          <p className="text-muted-foreground mb-4">
            Return to the dashboard to open a basis trade position on {market.name}.
          </p>
          <Link href="/" className="inline-block px-4 py-2 bg-crimson text-white rounded-lg hover:bg-crimson-dark transition-colors">
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
