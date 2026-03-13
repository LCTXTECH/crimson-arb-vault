import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sentry AI | CrimsonArb Documentation",
  description: "Understand how CrimsonArb's Sentry AI agent monitors and executes basis trades.",
}

export default function SentryAiDocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/docs" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Documentation
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Sentry AI</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Understand how our AI agent monitors and executes delta-neutral basis trades.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What is Sentry?</h2>
            <p className="text-muted-foreground">
              Sentry is CrimsonArb&apos;s proprietary AI agent that continuously monitors funding rates across 
              Drift Protocol markets. It identifies arbitrage opportunities and executes delta-neutral 
              basis trades to capture yield while maintaining market neutrality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Decision Matrix</h2>
            <p className="text-muted-foreground mb-4">Sentry evaluates trades using a multi-factor decision matrix:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Funding Yield Intensity</strong> - Current funding rate APY potential</li>
              <li><strong className="text-foreground">Liquidity Depth</strong> - Available market depth to execute without slippage</li>
              <li><strong className="text-foreground">Predicted Decay</strong> - Expected duration of favorable funding conditions</li>
              <li><strong className="text-foreground">Risk Assessment</strong> - Liquidation proximity and market volatility</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Trade Types</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-crimson">OPEN_BASIS</h3>
                <p className="text-muted-foreground text-sm">Opens a new delta-neutral position when funding rates are favorable.</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-crimson">CLOSE_BASIS</h3>
                <p className="text-muted-foreground text-sm">Closes an existing position when funding rates normalize.</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-crimson">FUNDING_CAPTURE</h3>
                <p className="text-muted-foreground text-sm">Short-term position to capture a specific funding payment window.</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-crimson">REBALANCE</h3>
                <p className="text-muted-foreground text-sm">Adjusts position sizes to maintain delta neutrality.</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-crimson">LIQUIDATION_GUARD</h3>
                <p className="text-muted-foreground text-sm">Emergency action to prevent liquidation during extreme volatility.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Human-in-the-Loop</h2>
            <p className="text-muted-foreground">
              By default, Sentry operates in advisory mode where all trades require your approval. 
              You can enable &quot;Sentry Shield&quot; to allow autonomous execution within your configured 
              risk parameters.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
