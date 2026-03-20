import type { Metadata } from "next"
import Link from "next/link"
import { ChaosDemo } from "@/components/chaos-demo"
import { SiteFooter } from "@/components/site-footer"
import { WebacyBadge, WebacySecuredBadge } from "@/components/webacy-badge"

export const metadata: Metadata = {
  title: "DeFi Flash Crash Protection — CrimsonARB GUARD Demo",
  description:
    "Watch CrimsonARB's AgentSentry circuit-breaker block a simulated funding rate manipulation in real time. See what happens when a vault doesn't have AI protection.",
  keywords: [
    "DeFi vault flash crash",
    "funding rate manipulation protection",
    "Drift Protocol circuit breaker",
    "DeFi security",
    "AI trading protection",
  ],
  openGraph: {
    title: "DeFi Flash Crash Protection — CrimsonARB GUARD Demo",
    description: "Watch the AgentSentry circuit-breaker block a manipulation event in real time.",
    type: "website",
  },
}

function CrimsonLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
      <path
        d="M20 4C20 4 28 8 28 16C28 20 26 24 22 26C26 22 24 16 20 14C16 16 14 22 18 26C14 24 12 20 12 16C12 8 20 4 20 4Z"
        fill="currentColor"
        className="text-primary"
      />
      <circle cx="20" cy="30" r="4" fill="currentColor" className="text-primary" />
    </svg>
  )
}

export default function ChaosDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CrimsonLogo />
            <span className="font-mono text-lg font-bold text-primary">CRIMSONARB</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/sandbox"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sandbox
            </Link>
            <Link
              href="/proof-of-no-trade"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Proof of No-Trade
            </Link>
            <Link
              href="/whitepaper"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Whitepaper
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            GUARD CIRCUIT-BREAKER DEMO
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-4">
            What happens when a vault doesn&apos;t have a circuit-breaker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This simulation demonstrates how CrimsonARB&apos;s AgentSentry integration blocks a
            funding rate manipulation event before capital is at risk.
          </p>
        </div>

        {/* Static Comparison Table */}
        <div className="mb-12 rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 border-b border-border">
            <h2 className="font-mono text-sm font-semibold">
              The Difference: 60 Seconds That Matter
            </h2>
          </div>
          <div className="grid md:grid-cols-2">
            {/* Without */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-mono text-sm text-red-500 font-bold">Standard Vault</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:00</span>
                  <span>Funding spike detected</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:05</span>
                  <span>&ldquo;Alpha opportunity!&rdquo; - Position opened</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:45</span>
                  <span>Rate collapses - manipulation detected</span>
                </div>
                <div className="flex items-start gap-2 text-red-500">
                  <span className="text-muted-foreground">01:00</span>
                  <span>Exit at loss: -$865 (-2.1%)</span>
                </div>
                <div className="pt-2 border-t border-border text-muted-foreground">
                  No audit trail. No reasoning. Just a loss.
                </div>
              </div>
            </div>

            {/* With CrimsonARB */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-mono text-sm text-emerald-500 font-bold">CrimsonARB</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:00</span>
                  <span>Funding spike detected - analyzing...</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:15</span>
                  <span>OI concentration: 31.4% (threshold: 25%)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:35</span>
                  <span>AgentSentry verdict: BLOCK</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">00:40</span>
                  <span className="flex items-center gap-2">
                    Webacy DD.xyz: <WebacyBadge variant="icon" score={18} riskLevel="CRITICAL" />
                  </span>
                </div>
                <div className="flex items-start gap-2 text-emerald-500">
                  <span className="text-muted-foreground">00:45</span>
                  <span>Position never opened. $41,200 protected.</span>
                </div>
                <div className="pt-2 border-t border-border text-muted-foreground">
                  Three layers confirmed GUARD. Full audit trail.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="font-mono text-xl font-bold mb-2">Run the Simulation</h2>
            <p className="text-sm text-muted-foreground">
              Watch the 60-second sequence showing exactly how CrimsonARB handles a flash event.
            </p>
          </div>
          <ChaosDemo />
        </div>

        {/* Why This Matters */}
        <div className="rounded-lg border border-border p-6 mb-12">
          <h2 className="font-mono text-lg font-bold mb-4">Why This Matters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-mono text-sm font-bold mb-2">Pre-Finality Protection</h3>
              <p className="text-sm text-muted-foreground">
                AgentSentry blocks before capital moves, not after. Traditional circuit-breakers
                react to losses. Ours prevents them.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-mono text-sm font-bold mb-2">Full Audit Trail</h3>
              <p className="text-sm text-muted-foreground">
                Every GUARD event is documented with AI reasoning. Institutional compliance
                requirements met by default.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="font-mono text-sm font-bold mb-2">Pattern Recognition</h3>
              <p className="text-sm text-muted-foreground">
                The Sentry Brain cross-references historical manipulation events. 87% pattern match
                triggered this block.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Every decision — including every GUARD — is published.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/proof-of-no-trade"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono text-sm hover:bg-primary/90 transition-colors min-h-[48px] flex items-center"
            >
              View All Decisions
            </Link>
            <Link
              href="/sandbox"
              className="px-6 py-3 border border-border rounded-lg font-mono text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors min-h-[48px] flex items-center"
            >
              Return to Sandbox
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
