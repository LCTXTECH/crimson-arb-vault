import { Metadata } from "next"
import { notFound } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crimsonarb.com"

const MARKET_SEO: Record<string, {
  title: string
  description: string
  keywords: string[]
}> = {
  "sol-perp": {
    title: "SOL-PERP | Solana Perpetual Futures Trading",
    description: "Trade Solana perpetual futures with AI-powered basis arbitrage on CrimsonArb. Capture funding rates up to 45% APY on Drift Protocol. Delta-neutral SOL strategies.",
    keywords: ["SOL perpetual futures", "Solana funding rate arbitrage", "SOL-PERP trading", "Solana DeFi yield", "basis trading SOL", "Drift Protocol SOL", "Solana perpetuals"]
  },
  "btc-perp": {
    title: "BTC-PERP | Bitcoin Perpetual Futures Trading",
    description: "Institutional Bitcoin perpetual futures arbitrage on CrimsonArb. Automated basis trading capturing 15-40% APY. The most liquid crypto derivatives market.",
    keywords: ["BTC perpetual futures", "Bitcoin funding rate", "BTC-PERP arbitrage", "institutional Bitcoin", "Bitcoin basis trading", "crypto derivatives yield"]
  },
  "eth-perp": {
    title: "ETH-PERP | Ethereum Perpetual Futures Trading",
    description: "Ethereum perpetual futures with AI yield generation on CrimsonArb. Delta-neutral ETH exposure capturing 20-35% APY through funding rate arbitrage.",
    keywords: ["ETH perpetual futures", "Ethereum funding rate", "ETH-PERP trading", "Ethereum DeFi yield", "ETH basis trading", "Ethereum derivatives"]
  },
  "jto-perp": {
    title: "JTO-PERP | Jito Perpetual Futures Trading",
    description: "Trade Jito perpetual futures with advanced AI yield strategies on CrimsonArb. High APY opportunities from JTO funding rates with managed risk.",
    keywords: ["JTO perpetual futures", "Jito funding rate", "JTO-PERP trading", "Jito DeFi", "Solana MEV token", "Jito staking yield"]
  },
  "wif-perp": {
    title: "WIF-PERP | dogwifhat Perpetual Futures Trading",
    description: "dogwifhat perpetual futures with automated memecoin yield strategies on CrimsonArb. High-APY opportunities on Solana's premier memecoin market.",
    keywords: ["WIF perpetual futures", "dogwifhat funding rate", "WIF-PERP trading", "memecoin arbitrage", "Solana memecoin yield", "WIF DeFi"]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params
  const seo = MARKET_SEO[symbol?.toLowerCase()]

  if (!seo) {
    return { title: "Market Not Found | CrimsonArb" }
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${BASE_URL}/markets/${symbol.toLowerCase()}`,
      siteName: "CrimsonArb Vault",
      type: "website",
      images: [{
        url: `${BASE_URL}/og/markets/${symbol.toLowerCase()}.png`,
        width: 1200,
        height: 630,
        alt: `${symbol.toUpperCase()} Trading on CrimsonArb`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/og/markets/${symbol.toLowerCase()}.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/markets/${symbol.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
}

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
