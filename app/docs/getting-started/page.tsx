import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Getting Started | CrimsonArb Documentation",
  description: "Set up your CrimsonArb vault and start earning yield with AI-powered basis trading.",
}

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/docs" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Documentation
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Set up your vault and make your first deposit in minutes.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              CrimsonArb supports Phantom, Solflare, and other Solana wallets. Click the &quot;Get Started&quot; button 
              on the dashboard to begin the onboarding process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Create Your Institutional Vault</h2>
            <p className="text-muted-foreground">
              Your vault is a dedicated trading account that holds your deposited assets. The AI agent 
              (Sentry) will manage trades on your behalf within the parameters you set.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Enable Sentry Shield</h2>
            <p className="text-muted-foreground">
              Delegate trading authority to the Sentry AI to automatically capture funding rate arbitrage 
              opportunities on Drift Protocol. You maintain full custody of your assets.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Deposit Assets</h2>
            <p className="text-muted-foreground">
              Transfer USDC to your vault to start earning. The minimum deposit is $1,000 for optimal 
              strategy execution.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-lg border border-crimson/30 bg-crimson/5">
          <h3 className="text-lg font-semibold text-crimson mb-2">Ready to start?</h3>
          <p className="text-muted-foreground mb-4">
            Return to the dashboard and click &quot;Get Started&quot; to create your vault.
          </p>
          <Link href="/" className="inline-block px-4 py-2 bg-crimson text-white rounded-lg hover:bg-crimson-dark transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
