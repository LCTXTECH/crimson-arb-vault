"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OnboardingModal } from "@/components/onboarding-modal"

const VALID_MARKETS = ["sol-perp", "btc-perp", "eth-perp", "jto-perp", "wif-perp"]

// Comprehensive market data with SEO-optimized content
const MARKET_DATA: Record<string, {
  name: string
  fullName: string
  ticker: string
  description: string
  longDescription: string
  keywords: string[]
  fundingRate: string
  apy: string
  volume24h: string
  openInterest: string
  liquidityDepth: string
  volatility: string
  sentryScore: number
  features: string[]
  faqs: Array<{ q: string; a: string }>
}> = {
  "sol-perp": {
    name: "SOL-PERP",
    fullName: "Solana Perpetual Futures",
    ticker: "SOL",
    description: "Trade Solana perpetual futures with AI-powered basis arbitrage. Capture funding rates up to 45% APY on Drift Protocol.",
    longDescription: "CrimsonArb's SOL-PERP vault leverages advanced AI algorithms to execute delta-neutral basis trades on Solana's premier perpetual futures market. Our Sentry AI monitors funding rates 24/7, automatically opening and closing positions to capture yield while maintaining market-neutral exposure.",
    keywords: ["SOL perpetual futures", "Solana funding rate", "SOL-PERP arbitrage", "Solana DeFi yield", "basis trading Solana"],
    fundingRate: "+0.0125%",
    apy: "45.6%",
    volume24h: "$847.2M",
    openInterest: "$234.5M",
    liquidityDepth: "$12.4M",
    volatility: "Medium",
    sentryScore: 94,
    features: [
      "Highest liquidity perpetual on Drift Protocol",
      "Consistent positive funding rates",
      "Sub-second execution latency",
      "Native SOL gas efficiency"
    ],
    faqs: [
      { q: "What is SOL-PERP basis trading?", a: "Basis trading involves simultaneously holding a long spot position and a short perpetual position, earning the funding rate differential while maintaining delta neutrality." },
      { q: "How often are funding rates paid?", a: "Drift Protocol calculates funding every hour, with payments settled automatically. CrimsonArb compounds these payments to maximize APY." },
      { q: "What are the risks?", a: "While delta-neutral strategies minimize directional risk, there are still risks from funding rate reversals, liquidation during extreme volatility, and smart contract exposure." }
    ]
  },
  "btc-perp": {
    name: "BTC-PERP",
    fullName: "Bitcoin Perpetual Futures",
    ticker: "BTC",
    description: "Institutional-grade Bitcoin perpetual futures arbitrage. Automated basis trading capturing 15-40% APY on the most liquid crypto market.",
    longDescription: "Access Bitcoin exposure with risk-managed returns through CrimsonArb's BTC-PERP vault. Our AI-driven strategy executes precise basis trades on Bitcoin perpetual futures, the most liquid cryptocurrency derivatives market. Ideal for institutional allocators seeking consistent yield generation.",
    keywords: ["BTC perpetual futures", "Bitcoin funding rate", "BTC-PERP arbitrage", "Bitcoin DeFi yield", "institutional Bitcoin trading"],
    fundingRate: "+0.0082%",
    apy: "29.9%",
    volume24h: "$1.24B",
    openInterest: "$456.8M",
    liquidityDepth: "$28.6M",
    volatility: "Low",
    sentryScore: 98,
    features: [
      "Deepest liquidity across all Drift markets",
      "Institutional-grade execution",
      "Cross-margin efficiency",
      "Proven track record since 2023"
    ],
    faqs: [
      { q: "Why trade BTC-PERP on Solana?", a: "Solana offers sub-second finality, minimal gas costs, and Drift Protocol provides deep liquidity matching centralized exchanges." },
      { q: "Is my Bitcoin safe?", a: "CrimsonArb uses non-custodial smart contracts. Your assets remain in your control, delegating only trading authority to our AI." },
      { q: "What's the minimum investment?", a: "There is no minimum, but we recommend at least $1,000 for optimal fee efficiency." }
    ]
  },
  "eth-perp": {
    name: "ETH-PERP",
    fullName: "Ethereum Perpetual Futures",
    ticker: "ETH",
    description: "Ethereum perpetual futures with automated yield generation. Delta-neutral ETH exposure capturing 20-35% APY through funding rate arbitrage.",
    longDescription: "CrimsonArb's ETH-PERP vault provides automated Ethereum basis trading on Drift Protocol. Leverage the second-largest cryptocurrency's perpetual futures market while our Sentry AI optimizes entry and exit timing to maximize funding rate capture.",
    keywords: ["ETH perpetual futures", "Ethereum funding rate", "ETH-PERP arbitrage", "Ethereum DeFi yield", "ETH basis trading"],
    fundingRate: "+0.0098%",
    apy: "35.8%",
    volume24h: "$623.4M",
    openInterest: "$312.1M",
    liquidityDepth: "$18.2M",
    volatility: "Medium",
    sentryScore: 96,
    features: [
      "Second-highest volume on Drift",
      "Strong correlation with broader market",
      "Optimal for diversified portfolios",
      "ETH staking yield augmentation"
    ],
    faqs: [
      { q: "Can I combine this with ETH staking?", a: "Yes! Many users stack ETH-PERP yields on top of liquid staking tokens for enhanced returns." },
      { q: "How does ETH-PERP compare to BTC-PERP?", a: "ETH typically offers higher funding rates due to increased speculation, but with slightly more volatility in those rates." },
      { q: "What happens during Ethereum upgrades?", a: "Our AI monitors on-chain events and adjusts position sizing during major network events to manage risk." }
    ]
  },
  "jto-perp": {
    name: "JTO-PERP",
    fullName: "Jito Perpetual Futures",
    ticker: "JTO",
    description: "Trade Jito perpetual futures with advanced yield strategies. Capture high APY from JTO funding rates with AI-managed risk.",
    longDescription: "JTO-PERP offers exceptional yield opportunities as a newer, more volatile market. CrimsonArb's Sentry AI specializes in identifying optimal entry points and managing the increased volatility of mid-cap perpetuals.",
    keywords: ["JTO perpetual futures", "Jito funding rate", "JTO-PERP trading", "Jito DeFi", "Solana MEV token"],
    fundingRate: "+0.0245%",
    apy: "89.4%",
    volume24h: "$124.6M",
    openInterest: "$45.2M",
    liquidityDepth: "$4.8M",
    volatility: "High",
    sentryScore: 82,
    features: [
      "Highest funding rates on Drift",
      "MEV-linked token dynamics",
      "Growing institutional interest",
      "Solana ecosystem native"
    ],
    faqs: [
      { q: "Why are JTO funding rates so high?", a: "JTO's role in Solana's MEV ecosystem creates unique demand dynamics, often resulting in elevated perpetual premiums." },
      { q: "What's the recommended allocation?", a: "Due to higher volatility, we suggest JTO-PERP comprise no more than 20% of your CrimsonArb portfolio." },
      { q: "Is JTO-PERP suitable for beginners?", a: "We recommend starting with BTC or SOL vaults. JTO is better suited for experienced users comfortable with higher volatility." }
    ]
  },
  "wif-perp": {
    name: "WIF-PERP",
    fullName: "dogwifhat Perpetual Futures",
    ticker: "WIF",
    description: "dogwifhat perpetual futures with automated memecoin yield strategies. High-APY opportunities on Solana's premier memecoin.",
    longDescription: "WIF-PERP captures the explosive volatility of Solana's leading memecoin. CrimsonArb's AI is specifically tuned to navigate memecoin market dynamics, taking advantage of extreme funding rate swings while managing downside risk.",
    keywords: ["WIF perpetual futures", "dogwifhat funding rate", "WIF-PERP trading", "memecoin arbitrage", "Solana memecoin yield"],
    fundingRate: "+0.0312%",
    apy: "113.9%",
    volume24h: "$89.3M",
    openInterest: "$28.7M",
    liquidityDepth: "$2.1M",
    volatility: "Very High",
    sentryScore: 71,
    features: [
      "Extreme yield potential",
      "Memecoin market dynamics",
      "Quick position rotation",
      "Community-driven demand"
    ],
    faqs: [
      { q: "How risky is WIF-PERP trading?", a: "Memecoins carry significant volatility risk. Our AI uses tighter risk parameters and smaller position sizes for WIF trades." },
      { q: "Can funding rates go negative?", a: "Yes. During bear cycles, WIF funding can flip negative. Our AI closes positions when sustained negative funding is detected." },
      { q: "What's the maximum allocation?", a: "We cap WIF exposure at 10% of vault TVL to manage concentration risk." }
    ]
  }
}

export default function MarketPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const market = MARKET_DATA[symbol?.toLowerCase()]

  if (!market) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader onGetStarted={() => setIsOnboardingOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b border-border bg-gradient-to-b from-crimson/5 to-transparent">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="lg:max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-crimson/20 text-crimson border border-crimson/30">
                    Live Market
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    Drift Protocol
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                  {market.fullName}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  {market.longDescription}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-crimson px-6 py-3 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
                  >
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <Link
                    href="/docs/getting-started"
                    className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-crimson/50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 lg:p-8 min-w-[320px]">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold">{market.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF88] opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF88]"></span>
                    </span>
                    <span className="text-xs text-[#00FF88]">Live</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Funding Rate</span>
                    <span className="text-lg font-semibold text-[#00FF88]">{market.fundingRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Annualized APY</span>
                    <span className="text-lg font-semibold text-crimson">{market.apy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="text-lg font-semibold">{market.volume24h}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open Interest</span>
                    <span className="text-lg font-semibold">{market.openInterest}</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Sentry Score</span>
                      <span className="text-sm font-semibold">{market.sentryScore}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-crimson to-[#00FF88] rounded-full transition-all duration-500"
                        style={{ width: `${market.sentryScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
            <h2 className="text-2xl font-bold mb-8">Why Trade {market.name}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {market.features.map((feature, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <div className="h-10 w-10 rounded-lg bg-crimson/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Metrics Grid */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
            <h2 className="text-2xl font-bold mb-8">Market Metrics</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm text-muted-foreground mb-2">Liquidity Depth</h3>
                <p className="text-3xl font-bold">{market.liquidityDepth}</p>
                <p className="text-sm text-muted-foreground mt-1">Within 2% of mark price</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm text-muted-foreground mb-2">Volatility Level</h3>
                <p className="text-3xl font-bold">{market.volatility}</p>
                <p className="text-sm text-muted-foreground mt-1">30-day rolling average</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm text-muted-foreground mb-2">Sentry AI Status</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF88] opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00FF88]"></span>
                  </span>
                  <span className="text-2xl font-bold text-[#00FF88]">Active</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Monitoring for opportunities</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {market.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-transparent to-crimson/5">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Trading {market.name} Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders capturing funding rate yields with AI-powered automation.
            </p>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-crimson px-8 py-4 text-lg font-medium text-white hover:bg-crimson-dark transition-colors"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>

        {/* SEO Keywords Section (hidden visually but helps crawlers) */}
        <section className="sr-only">
          <h2>Related Keywords</h2>
          <ul>
            {market.keywords.map((kw, i) => (
              <li key={i}>{kw}</li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />

      {mounted && (
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={() => setIsOnboardingOpen(false)}
        />
      )}
    </div>
  )
}


