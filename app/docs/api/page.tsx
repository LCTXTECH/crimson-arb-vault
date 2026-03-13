import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "API Reference | CrimsonArb Documentation",
  description: "Integrate CrimsonArb with your own systems via our REST API.",
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/docs" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Documentation
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Integrate CrimsonArb with your own systems via our REST API.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All API requests require an API key passed in the X-API-Key header.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`curl -X GET https://api.crimsonarb.com/v1/vault \\
  -H "X-API-Key: your_api_key"`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded">GET</span>
                <code className="text-sm font-mono">/v1/vault</code>
              </div>
              <p className="text-muted-foreground text-sm">Get vault status, balance, and current positions.</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded">GET</span>
                <code className="text-sm font-mono">/v1/trades</code>
              </div>
              <p className="text-muted-foreground text-sm">List all executed trades with AI reasoning.</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 rounded">POST</span>
                <code className="text-sm font-mono">/v1/claw/execute</code>
              </div>
              <p className="text-muted-foreground text-sm">Execute a trade approved by the Sentry AI.</p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded">GET</span>
                <code className="text-sm font-mono">/v1/markets/:symbol</code>
              </div>
              <p className="text-muted-foreground text-sm">Get market data and funding rates for a specific perp market.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
