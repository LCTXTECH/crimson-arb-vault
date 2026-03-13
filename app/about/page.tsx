import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | CrimsonArb",
  description: "Learn about CrimsonArb's mission to democratize institutional-grade yield strategies.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">About CrimsonArb</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Democratizing institutional-grade yield strategies through AI-powered automation.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              CrimsonArb was built to bring institutional-grade delta-neutral arbitrage strategies to 
              everyone. What was once the domain of hedge funds with dedicated quant teams is now 
              accessible through our AI-powered vault system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">The Technology</h2>
            <p className="text-muted-foreground">
              Our Sentry AI agent operates on Drift Protocol, the leading perpetual futures DEX on 
              Solana. By continuously monitoring funding rates across markets, Sentry identifies and 
              captures arbitrage opportunities with sub-second precision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security First</h2>
            <p className="text-muted-foreground">
              Your assets remain in your custody at all times. CrimsonArb uses delegated trading 
              authority - the AI can execute trades on your behalf, but cannot withdraw funds. 
              All positions are fully collateralized and delta-neutral by design.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Global Reach</h2>
            <p className="text-muted-foreground">
              CrimsonArb operates 24/7 across global markets, with optimized execution infrastructure 
              in Singapore, Hong Kong, Dubai, New York, London, Frankfurt, and Tokyo.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/docs" className="px-4 py-2 bg-crimson text-white rounded-lg hover:bg-crimson-dark transition-colors">
            Read Documentation
          </Link>
          <Link href="/security" className="px-4 py-2 border border-border text-foreground rounded-lg hover:border-crimson/50 transition-colors">
            Security Details
          </Link>
        </div>
      </div>
    </div>
  )
}
