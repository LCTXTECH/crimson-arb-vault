import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Documentation | CrimsonArb",
  description: "Learn how to use CrimsonArb's AI-powered basis trading vault on Drift Protocol.",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Learn how to use CrimsonArb&apos;s AI-powered delta-neutral arbitrage vault.
        </p>

        <div className="grid gap-6">
          <Link href="/docs/getting-started" className="block p-6 rounded-lg border border-border bg-card hover:border-crimson/50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
            <p className="text-muted-foreground">Set up your vault and make your first deposit in minutes.</p>
          </Link>

          <Link href="/docs/api" className="block p-6 rounded-lg border border-border bg-card hover:border-crimson/50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">API Reference</h2>
            <p className="text-muted-foreground">Integrate CrimsonArb with your own systems via our REST API.</p>
          </Link>

          <Link href="/docs/sentry-ai" className="block p-6 rounded-lg border border-border bg-card hover:border-crimson/50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Sentry AI</h2>
            <p className="text-muted-foreground">Understand how our AI agent monitors and executes trades.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
