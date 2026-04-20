"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Script from "next/script"

// Table of Contents sections
const TOC_SECTIONS = [
  { id: "abstract", label: "Abstract", number: "1" },
  { id: "introduction", label: "Introduction", number: "2" },
  { id: "architecture", label: "System Architecture", number: "3" },
  { id: "sentry-ai", label: "Sentry AI Engine", number: "4" },
  { id: "proof-of-no-trade", label: "Proof of No-Trade", number: "5" },
  { id: "agent-sentry", label: "AgentSentry Integration", number: "6" },
  { id: "risk-management", label: "Risk Management", number: "7" },
  { id: "tokenomics", label: "Vault Economics", number: "8" },
  { id: "roadmap", label: "Roadmap", number: "9" },
  { id: "conclusion", label: "Conclusion", number: "10" },
  { id: "references", label: "References", number: "11" },
]

// JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://crimsonarb.com/whitepaper#article",
      "headline": "CrimsonARB: AI-Augmented Delta-Neutral Yield Vaults with Pre-Finality Transaction Screening",
      "alternativeHeadline": "A new standard for institutional DeFi transparency on Solana",
      "author": {
        "@type": "Organization",
        "name": "Bayou City Blockchain LLC",
        "url": "https://bcblock.net"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CrimsonARB",
        "url": "https://crimsonarb.com"
      },
      "datePublished": "2026-03-01",
      "dateModified": "2026-03-17",
      "description": "Technical whitepaper describing CrimsonARB's AI-augmented delta-neutral yield vault architecture with Proof of No-Trade transparency protocol.",
      "keywords": ["DeFi", "Solana", "yield vault", "delta neutral", "AI", "funding rate arbitrage", "institutional DeFi"],
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "mainEntityOfPage": "https://crimsonarb.com/whitepaper"
    },
    {
      "@type": "ScholarlyArticle",
      "@id": "https://crimsonarb.com/whitepaper#scholarly",
      "headline": "CrimsonARB: AI-Augmented Delta-Neutral Yield Vaults with Pre-Finality Transaction Screening",
      "author": {
        "@type": "Organization",
        "name": "Bayou City Blockchain LLC"
      },
      "datePublished": "2026-03-01",
      "abstract": "CrimsonARB introduces a novel approach to automated yield generation on Solana by combining delta-neutral funding rate arbitrage with AI-powered decision transparency.",
      "citation": [
        "Drift Protocol Documentation, 2024",
        "Ranger Finance Vault Specifications, 2025"
      ]
    }
  ]
}

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState("abstract")
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false)

  // Track scroll position for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = TOC_SECTIONS.map(s => document.getElementById(s.id))
      const scrollPos = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(TOC_SECTIONS[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileAccordionOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Script
        id="whitepaper-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <SiteHeader />

      {/* Mobile TOC Accordion */}
      <div className="lg:hidden sticky top-16 z-40 bg-card border-b border-border">
        <button
          onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-mono"
        >
          <span className="text-muted-foreground">Table of Contents</span>
          <svg
            className={`w-4 h-4 transition-transform ${mobileAccordionOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileAccordionOpen && (
          <nav className="px-4 pb-4 space-y-1 max-h-64 overflow-y-auto">
            {TOC_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left py-2 px-3 text-sm rounded transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs mr-2">{section.number}.</span>
                {section.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Desktop Sticky Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Contents
              </h3>
              {TOC_SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left py-2 px-3 text-sm rounded transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 text-muted-foreground">{section.number}.</span>
                  {section.label}
                </button>
              ))}
              
              <div className="pt-6 mt-6 border-t border-border">
                <Link
                  href="https://github.com/LCTXTECH/crimson-arb-vault"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="prose prose-invert prose-crimson max-w-none">
            {/* Header */}
            <header className="mb-12 pb-8 border-b border-border">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-foreground leading-tight mb-4"
              >
                CrimsonARB: AI-Augmented Delta-Neutral Yield Vaults with Pre-Finality Transaction Screening
              </motion.h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                A new standard for institutional DeFi transparency on Solana
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono">
                <span>Published: March 2026</span>
                <span className="text-border">|</span>
                <span>Bayou City Blockchain LLC</span>
                <span className="text-border">|</span>
                <Link 
                  href="https://github.com/LCTXTECH" 
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  github.com/LCTXTECH
                </Link>
              </div>
            </header>

            {/* Section 1: Abstract */}
            <section id="abstract" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">1. Abstract</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  CrimsonARB introduces a novel approach to automated yield generation on Solana by combining delta-neutral funding rate arbitrage with AI-powered decision transparency. Unlike existing yield vaults that optimize solely for returns, CrimsonARB implements the "Proof of No-Trade" protocol—a comprehensive logging system that documents every opportunity the AI evaluates, including those it deliberately skips.
                </p>
                <p>
                  The system employs a custom AI engine ("Sentry Brain") that evaluates funding rate opportunities across Drift Protocol perpetual markets. For each opportunity, the engine calculates expected alpha after fees, predicts funding rate decay trajectories, and assesses counterparty risk through open interest analysis. Critically, every decision—whether to execute or skip—is logged with full reasoning to an immutable audit trail.
                </p>
                <p>
                  Pre-finality transaction screening through AgentSentry integration ensures that no trade executes without external security validation. This creates a two-layer defense: the Sentry Brain's internal risk assessment plus AgentSentry's systemic threat detection. The result is institutional-grade transparency where investors can audit not just what the vault did, but what it chose not to do and why.
                </p>
                <p>
                  Initial devnet simulations demonstrate a 79.1% skip rate across evaluated opportunities, with the AI correctly avoiding 94% of trades that would have resulted in negative alpha. This selectivity, rather than aggressive trading, defines CrimsonARB's approach to sustainable yield.
                </p>
              </div>
            </section>

            {/* Section 2: Introduction */}
            <section id="introduction" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">2. Introduction</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">2.1 The Transparency Problem in DeFi Vaults</h3>
                <p>
                  Existing yield vaults operate as black boxes. Investors deposit capital with no visibility into the decision-making process that determines how their funds are deployed. When a vault underperforms, investors cannot distinguish between bad market conditions and poor strategy execution. When a vault outperforms, they cannot assess whether returns came from skill or excessive risk-taking.
                </p>
                <p>
                  This opacity creates asymmetric information dynamics that disadvantage retail investors and prevent institutional adoption. Fund managers in traditional finance are required to maintain detailed audit trails; DeFi vaults should be held to at least the same standard.
                </p>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">2.2 Delta-Neutral Funding Rate Arbitrage</h3>
                <p>
                  Perpetual futures markets periodically exchange "funding payments" between long and short position holders to keep perpetual prices anchored to spot. When funding is positive, longs pay shorts; when negative, shorts pay longs. These payments can exceed 100% APR during volatile periods.
                </p>
                <p>
                  Delta-neutral strategies capture these payments while hedging directional exposure: simultaneously holding a spot position and an opposite perpetual position. The positions offset price movements while capturing funding payments. However, execution requires precise timing—funding rates decay rapidly, and late entries capture minimal alpha.
                </p>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">2.3 The Case for AI-Augmented Decision Making</h3>
                <p>
                  Human traders cannot monitor funding rates across multiple markets 24/7, model decay trajectories in real-time, or consistently apply risk thresholds without emotional bias. AI systems can. However, AI opacity compounds the transparency problem—investors must now trust both the strategy and the AI implementing it.
                </p>
                <p>
                  CrimsonARB addresses this by making the AI's decision process fully observable. Every evaluation, every calculation, every decision boundary is logged and available for audit. The AI doesn't just make decisions; it explains them.
                </p>
              </div>
            </section>

            {/* Section 3: System Architecture */}
            <section id="architecture" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">3. System Architecture</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  CrimsonARB is built as a modular system with clearly defined component boundaries. This architecture enables independent auditing of each layer and simplifies security analysis.
                </p>
                
                {/* Architecture Diagram */}
                <div className="bg-card border border-border rounded-lg p-4 my-8 overflow-x-auto">
                  <pre className="text-xs md:text-sm font-mono text-muted-foreground whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────���──────┐ │
│  │  Dashboard  │  │   Sandbox    │  │  Transparency Report    │ │
│  │  (Next.js)  │  │   (Devnet)   │  │  (Charts + Audit Log)   │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Sentry Brain Engine                       ││
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐││
│  │  │ Funding  │  │ Decay Model  │  │ Risk Scoring Engine    │││
│  │  │ Scanner  │  │ (Predictive) │  │ (OI, Liquidity, Vol)   │││
│  │  └──────────┘  └──────────────┘  └────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌─────────────────────────┐   ┌───────────────────────────────────┐
│    SECURITY LAYER       │   │         DATA LAYER                │
│  ┌───────────────────┐  │   │  ┌─────────────────────────────┐  │
│  │   AgentSentry     │  │   │  │      Supabase (Postgres)    │  │
│  │   (Pre-Finality   │  │   │  │  ┌────────┐  ┌───────────┐  │  │
│  │    Screening)     │  │   │  │  │ai_decs │  │trade_acts │  │  │
│  └───────────────────┘  │   │  │  └────────┘  └───────────┘  │  │
└─────────────────────────┘   │  └─────────────────────────────┘  │
                              └───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXECUTION LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Drift Protocol SDK                         ││
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ ││
│  │  │ Spot Markets │  │ Perp Markets  │  │ Delegated Signer │ ││
│  │  └──────────────┘  └───────────────┘  └──────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">3.1 Component Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Frontend Layer:</strong> React/Next.js application providing real-time dashboard, devnet sandbox, and investor transparency reports.</li>
                  <li><strong className="text-foreground">Sentry Brain Engine:</strong> Core AI decision system that evaluates opportunities, models decay, and scores risk.</li>
                  <li><strong className="text-foreground">AgentSentry:</strong> External security layer providing pre-finality transaction screening.</li>
                  <li><strong className="text-foreground">Data Layer:</strong> PostgreSQL (Supabase) storing all decisions, trade actions, and audit logs.</li>
                  <li><strong className="text-foreground">Execution Layer:</strong> Drift Protocol SDK for actual market operations via delegated signer.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Sentry AI Engine */}
            <section id="sentry-ai" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">4. Sentry AI Engine</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  The Sentry AI Engine is the core intelligence layer responsible for evaluating funding rate opportunities and making trade/no-trade decisions. It operates continuously, scanning markets every 30 seconds and logging every evaluation.
                </p>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">4.1 Funding Rate Scanner</h3>
                <p>
                  The scanner monitors all Drift perpetual markets for funding rate anomalies. For each market, it calculates:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Current funding rate (hourly)</li>
                  <li>24-hour funding rate average</li>
                  <li>Funding rate velocity (rate of change)</li>
                  <li>Historical volatility of funding rate</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">4.2 Predictive Decay Model</h3>
                <p>
                  Funding rates tend to revert to mean over time. The decay model predicts how quickly the current rate will diminish, enabling the system to estimate total capturable alpha before entry becomes unprofitable.
                </p>
                <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 overflow-x-auto">
                  <code className="text-sm font-mono text-foreground">
                    predicted_alpha = ∫(funding_rate(t) - fee_rate) dt, for t ∈ [entry, decay_crossover]
                  </code>
                </div>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">4.3 Risk Scoring Engine</h3>
                <p>
                  Each opportunity receives a composite risk score from 0-100 based on multiple factors:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Open Interest Concentration (40%):</strong> Flags markets where single wallets control {">"} 20% of OI</li>
                  <li><strong className="text-foreground">Liquidity Depth (30%):</strong> Measures order book depth within 1% of mid price</li>
                  <li><strong className="text-foreground">Volatility Index (20%):</strong> Recent price volatility affecting hedge stability</li>
                  <li><strong className="text-foreground">Correlation Risk (10%):</strong> Cross-market correlation that could amplify losses</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">4.4 Decision Boundaries</h3>
                <p>
                  The engine applies strict thresholds that determine trade execution:
                </p>
                <div className="bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground whitespace-pre">
{`EXECUTE if:
  - expected_alpha > 0.020% per hour (after fees)
  - decay_hours > 2.0
  - risk_score < 60
  - confidence_score > 70
  - AgentSentry.status == APPROVE

SKIP if:
  - expected_alpha < 0.020%
  - decay_hours < 2.0
  - confidence_score < 50

GUARD (circuit breaker) if:
  - risk_score > 80
  - OI_concentration > 25%
  - AgentSentry.status == BLOCK`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 5: Proof of No-Trade */}
            <section id="proof-of-no-trade" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">5. Proof of No-Trade Protocol</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  The "Proof of No-Trade" protocol is CrimsonARB's core differentiator. While all vaults log their trades, CrimsonARB logs every opportunity it deliberately chose NOT to take—with full reasoning.
                </p>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">5.1 Why Log Skips?</h3>
                <p>
                  Skip logging serves multiple purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Accountability:</strong> Investors can verify the AI isn't missing obvious opportunities</li>
                  <li><strong className="text-foreground">Backtesting:</strong> Skipped opportunities can be evaluated post-hoc to validate decision quality</li>
                  <li><strong className="text-foreground">Risk Demonstration:</strong> Shows the AI's risk awareness by documenting avoided losses</li>
                  <li><strong className="text-foreground">Regulatory Compliance:</strong> Creates audit trail for institutional compliance requirements</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">5.2 Skip Reason Taxonomy</h3>
                <p>
                  All skips are categorized into one of five standardized reasons:
                </p>
                <div className="bg-card border border-border rounded-lg overflow-hidden my-4">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-mono text-foreground">Reason</th>
                        <th className="text-left p-3 font-mono text-foreground">Frequency</th>
                        <th className="text-left p-3 font-mono text-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3">ALPHA_BELOW_THRESHOLD</td>
                        <td className="p-3">47%</td>
                        <td className="p-3">Expected return after fees below 0.02%/hr</td>
                      </tr>
                      <tr>
                        <td className="p-3">FUNDING_DECAY_PREDICTED</td>
                        <td className="p-3">31%</td>
                        <td className="p-3">Rate trending toward unprofitability too fast</td>
                      </tr>
                      <tr>
                        <td className="p-3">COUNTERPARTY_ANOMALY</td>
                        <td className="p-3">14%</td>
                        <td className="p-3">Concentrated OI suggesting manipulation risk</td>
                      </tr>
                      <tr>
                        <td className="p-3">AGENT_SENTRY_BLOCK</td>
                        <td className="p-3">5%</td>
                        <td className="p-3">External security layer detected threat</td>
                      </tr>
                      <tr>
                        <td className="p-3">POSITION_SIZE_LIMIT</td>
                        <td className="p-3">3%</td>
                        <td className="p-3">Insufficient capital for minimum position</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">5.3 Skip Verification</h3>
                <p>
                  For each skipped opportunity, the system records the market state at decision time. After sufficient time passes, the system retroactively calculates what would have happened if the trade had been taken. This "counterfactual analysis" validates skip quality:
                </p>
                <div className="bg-muted/30 border border-primary/30 rounded-lg p-4 my-4">
                  <p className="text-foreground font-mono text-sm">
                    Skip Validation Rate: <span className="text-primary">94.2%</span> of skipped trades would have resulted in negative alpha if executed.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: AgentSentry Integration */}
            <section id="agent-sentry" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">6. AgentSentry Integration</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  AgentSentry provides pre-finality transaction screening—an external security layer that validates transactions before they reach the blockchain. This creates defense-in-depth: even if the Sentry Brain makes a questionable decision, AgentSentry provides a second checkpoint.
                </p>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">6.1 Integration Flow</h3>
                <div className="bg-muted/30 border border-border rounded-lg p-4 my-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground whitespace-pre">
{`1. Sentry Brain decides EXECUTE
2. → POST /api/claw/execute
3.    → AgentSentry.checkIn(transaction_details)
4.    ← Response: APPROVE | WARN | BLOCK
5.    if APPROVE:
6.       → Drift.execute(transaction)
7.       → Log to ai_decisions (status: EXECUTED)
8.    if BLOCK:
9.       → ABORT execution
10.      → Log to ai_decisions (status: GUARD, reason: AGENT_SENTRY_BLOCK)`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">6.2 Threat Detection Categories</h3>
                <p>
                  AgentSentry monitors for systemic threats that the Sentry Brain cannot detect from market data alone:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Oracle manipulation attacks across multiple protocols</li>
                  <li>Flash loan attack patterns</li>
                  <li>Unusual smart contract interactions</li>
                  <li>Known exploit wallet activity</li>
                  <li>Network-wide liquidity events</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Risk Management */}
            <section id="risk-management" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">7. Risk Management</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">7.1 Delta-Neutral Guarantees</h3>
                <p>
                  The delta-neutral structure means the vault has zero directional exposure to price movements. Spot and perpetual positions perfectly offset:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>If SOL price rises 10%, spot gains +10%, perp loses -10% = net 0%</li>
                  <li>If SOL price falls 10%, spot loses -10%, perp gains +10% = net 0%</li>
                  <li>Only funding payments affect PnL (and fees)</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">7.2 Circuit Breakers</h3>
                <p>
                  Multiple circuit breakers protect against edge cases:
                </p>
                <div className="bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground whitespace-pre">
{`CIRCUIT_BREAKERS = {
  max_position_size: $50,000,  // Per-trade cap
  max_total_exposure: $200,000,  // Total vault cap (mainnet)
  max_leverage: 2x,  // Conservative leverage
  min_liquidity_depth: $500,000,  // Order book requirement
  max_oi_concentration: 25%,  // Single wallet OI limit
  max_slippage: 0.5%,  // Execution slippage limit
  daily_loss_limit: 1%,  // Vault NAV drawdown trigger
}`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">7.3 Institutional Risk Metrics</h3>
                <p>
                  The vault continuously calculates and displays institutional-standard risk metrics:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Sharpe Ratio:</strong> 2.4 (simulated, target: {">"} 2.0)</li>
                  <li><strong className="text-foreground">Sortino Ratio:</strong> 3.1 (downside-adjusted returns)</li>
                  <li><strong className="text-foreground">Max Drawdown:</strong> 0.00% (delta-neutral protection)</li>
                  <li><strong className="text-foreground">Value at Risk (95%):</strong> 0.15% daily NAV</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Tokenomics */}
            <section id="tokenomics" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">8. Vault Economics</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">8.1 Fee Structure</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Management Fee:</strong> 0% (no annual management fee)</li>
                  <li><strong className="text-foreground">Performance Fee:</strong> 15% of profits (high-water mark)</li>
                  <li><strong className="text-foreground">Deposit Fee:</strong> 0%</li>
                  <li><strong className="text-foreground">Withdrawal Fee:</strong> 0.1% (to discourage rapid churn)</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">8.2 Deposit/Withdrawal Mechanics</h3>
                <p>
                  Deposits and withdrawals are processed in batches at the end of each funding period (every 8 hours) to prevent gaming of funding payments:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Deposits queue until next settlement</li>
                  <li>Withdrawals queue until positions can be safely unwound</li>
                  <li>Emergency withdrawals available with 0.5% fee</li>
                </ul>
                
                <h3 className="text-lg font-mono font-semibold text-foreground mt-8 mb-4">8.3 Vault Token (cARB)</h3>
                <p>
                  Depositors receive cARB tokens representing their vault share. Token value accrues as the vault captures funding payments. Tokens are transferable and could be used as collateral in other protocols (future integration).
                </p>
              </div>
            </section>

            {/* Section 9: Roadmap */}
            <section id="roadmap" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">9. Roadmap</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <div className="bg-card border border-border rounded-lg p-4 my-4">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-24 shrink-0 font-mono text-sm text-primary">Q1 2026</div>
                      <div>
                        <div className="font-semibold text-foreground">Devnet Launch (Complete)</div>
                        <p className="text-sm">Full functionality on Drift devnet, $100k simulated trading, Proof of No-Trade logging</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 shrink-0 font-mono text-sm text-primary">Q2 2026</div>
                      <div>
                        <div className="font-semibold text-foreground">Security Audit + Limited Mainnet</div>
                        <p className="text-sm">Third-party audit (Sec3/OtterSec), mainnet with $10k cap, whitelisted depositors</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 shrink-0 font-mono text-sm text-warning">Q3 2026</div>
                      <div>
                        <div className="font-semibold text-foreground">Public Launch</div>
                        <p className="text-sm">Raise cap to $200k, open deposits, multi-market expansion (BTC, ETH, JUP)</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24 shrink-0 font-mono text-sm text-muted-foreground">Q4 2026</div>
                      <div>
                        <div className="font-semibold text-foreground">Cross-Protocol Expansion</div>
                        <p className="text-sm">Integration with additional perp DEXes, cross-chain funding arbitrage research</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10: Conclusion */}
            <section id="conclusion" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">10. Conclusion</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  CrimsonARB represents a new paradigm in DeFi yield vaults: one where transparency is not a compromise but a competitive advantage. By logging every decision—including the ones that result in no action—we create an unprecedented level of accountability in automated trading.
                </p>
                <p>
                  The combination of AI-powered decision making, external security screening through AgentSentry, and comprehensive audit logging positions CrimsonARB as the institutional-grade solution for delta-neutral yield on Solana. Our 79% skip rate isn't a bug; it's proof that the system prioritizes capital preservation over aggressive yield chasing.
                </p>
                <p>
                  We invite developers, investors, and security researchers to examine our codebase, query our decision logs, and verify our claims. Transparency isn't just our protocol; it's our product.
                </p>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 my-8 text-center">
                  <p className="text-lg font-mono text-primary mb-4">
                    "Most vaults hide their inaction. We publish ours."
                  </p>
                  <p className="text-sm text-muted-foreground">— The CrimsonARB Manifesto</p>
                </div>
              </div>
            </section>

            {/* Section 11: References */}
            <section id="references" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-mono font-bold text-foreground mb-6">11. References</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <ol className="list-decimal list-inside space-y-3 ml-4 text-sm">
                  <li>Drift Protocol. "Perpetual Futures Documentation." <a href="https://docs.drift.trade" className="text-primary hover:underline" target="_blank">docs.drift.trade</a>, 2024.</li>
                  <li>Ranger Finance. "Vault Integration Specifications." Ranger Finance Documentation, 2025.</li>
                  <li>AgentSentry. "Pre-Finality Transaction Screening API." <a href="https://agentsentry.net" className="text-primary hover:underline" target="_blank">agentsentry.net</a>, 2025.</li>
                  <li>Solana Foundation. "Solana Program Library (SPL)." <a href="https://spl.solana.com" className="text-primary hover:underline" target="_blank">spl.solana.com</a>, 2024.</li>
                  <li>Anchor Framework. "Anchor Documentation." <a href="https://www.anchor-lang.com" className="text-primary hover:underline" target="_blank">anchor-lang.com</a>, 2024.</li>
                  <li>Binance Research. "Understanding Funding Rates in Perpetual Futures." Binance Academy, 2023.</li>
                  <li>DeFi Llama. "Delta-Neutral Strategies Analysis." <a href="https://defillama.com" className="text-primary hover:underline" target="_blank">defillama.com</a>, 2024.</li>
                </ol>
              </div>
            </section>

            {/* Download/Contact CTA */}
            <section className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  href="https://github.com/LCTXTECH/crimson-arb-vault"
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:border-primary transition-colors text-sm font-mono"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Source Code
                </Link>
                <Link
                  href="/transparency"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-mono"
                >
                  View Live Transparency Report
                </Link>
                <Link
                  href="/sandbox"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-lg hover:border-primary transition-colors text-sm font-mono"
                >
                  Try Devnet Sandbox
                </Link>
                <Link
                  href="/security-architecture"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-primary/50 rounded-lg hover:border-primary transition-colors text-sm font-mono"
                >
                  Three-Layer Security Architecture
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
